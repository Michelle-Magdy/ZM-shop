class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.mongoFilter = {};
    this.sortBy = "-createdAt";
    this.fields = "-__v";
    this.page = 1;
    this.limit = 20;
    this.skip = 0;
  }

  // =============================
  // 1️⃣ BASIC + RANGE FILTERS
  // =============================
  filter() {
    const queryObj = { ...this.queryString };

    const parsedQuery = {};

    for (const key in queryObj) {
      const value = queryObj[key];

      // Check if key has bracket notation: price[gte], rating[gt], etc.
      const bracketMatch = key.match(/^(.+)\[(.+)\]$/);

      if (bracketMatch) {
        const [, field, operator] = bracketMatch; // field='price', operator='gte'

        // Build nested structure: { price: { gte: value } }
        if (!parsedQuery[field]) parsedQuery[field] = {};
        parsedQuery[field][operator] = value;
      } else {
        // Regular key: search, page, sort, etc.
        parsedQuery[key] = value;
      }
    }

    // Now exclude fields from parsedQuery instead of queryObj
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "attributes",
      "variants",
    ];

    excludedFields.forEach((el) => delete parsedQuery[el]);

    // Convert to MongoDB operators ($gte, $gt, etc.)
    let queryStr = JSON.stringify(parsedQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let parsed = JSON.parse(queryStr);

    // Convert numbers
    const convertNumbers = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          convertNumbers(obj[key]);
        } else if (!isNaN(obj[key]) && obj[key] !== "" && obj[key] !== null) {
          obj[key] = Number(obj[key]);
        }
      }
    };

    convertNumbers(parsed);
    this.mongoFilter = { ...this.mongoFilter, ...parsed };

    return this;
  }

  // =============================
  // 2️⃣ SEARCH (title + description)
  // =============================
  search() {
    if (this.queryString.search) {
      const searchQuery = {
        $or: [
          {
            title: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: this.queryString.search,
              $options: "i",
            },
          },
        ],
      };

      this._addToFilter(searchQuery);
    }

    return this;
  }

  // =============================
  // 3️⃣ ATTRIBUTE FILTERS
  // attributes[battery]=5000&attributes[processor]=M3 Max
  // =============================
  attributes() {
    if (this.queryString) {
      const filters = {};

      Object.entries(this.queryString).forEach(([key, value]) => {
        const attrMatch = key.match(/^attributes\[(.+)\]$/);
        if (attrMatch) {
          filters[attrMatch[1]] = value;
        }
      });

      Object.keys(filters).forEach((key) => {
        const rawValue = filters[key];
        const numValue = Number(rawValue);
        const isNumber = !isNaN(numValue) && rawValue !== "";

        const filter = {
          attributes: {
            $elemMatch: {
              key: key,
              $or: [
                { value: rawValue }, // String match
                ...(isNumber ? [{ value: numValue }] : []), // Number match
              ],
            },
          },
        };

        this._addToFilter(filter);
      });
    }

    return this;
  }

  // =============================
  // 4️⃣ VARIANT FILTERS
  // variant[ram]=36GB&variant[color]=Black
  // =============================
  variants() {
    if (this.queryString) {
      const filters = {};

      Object.entries(this.queryString).forEach(([key, value]) => {
        const attrMatch = key.match(/^variants\[(.+)\]$/);
        if (attrMatch) {
          const attrKey = attrMatch[1];
          const values = value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v);
          filters[attrKey] = values;
        }
      });

      const filterKeys = Object.keys(filters);
      if (filterKeys.length === 0) return this;

      const buildPossibleValues = (values) => {
        const possibleValues = [];
        values.forEach((rawValue) => {
          // Add original value
          possibleValues.push(rawValue);

          // Add case variations
          possibleValues.push(rawValue.toLowerCase());
          possibleValues.push(rawValue.toUpperCase());
          possibleValues.push(
            rawValue.charAt(0).toUpperCase() + rawValue.slice(1).toLowerCase(),
          );

          // Add numeric version
          const numValue = Number(rawValue);
          if (!isNaN(numValue) && rawValue !== "") {
            possibleValues.push(numValue);
          }
        });
        // Remove duplicates
        return [...new Set(possibleValues)];
      };

      const andConditions = filterKeys.map((key) => {
        const values = buildPossibleValues(filters[key]);
        return {
          attributeValues: {
            $elemMatch: {
              key: key,
              value: values.length === 1 ? values[0] : { $in: values },
            },
          },
        };
      });

      let variantFilter;
      if (andConditions.length === 1) {
        variantFilter = {
          variants: {
            $elemMatch: {
              ...andConditions[0],
              isActive: true, // Only match active variants
            },
          },
        };
      } else {
        variantFilter = {
          variants: {
            $elemMatch: {
              $and: andConditions,
              isActive: true, // Only match active variants
            },
          },
        };
      }

      this._addToFilter(variantFilter);
    }
    return this;
  }

  // Helper method
  _buildPossibleValues(values) {
    const possibleValues = [];
    values.forEach((rawValue) => {
      possibleValues.push(rawValue);
      const numValue = Number(rawValue);
      if (!isNaN(numValue) && rawValue !== "") {
        possibleValues.push(numValue);
      }
    });
    return possibleValues;
  }
  // =============================
  // HELPER: Merge filters without overwriting
  // =============================
  _addToFilter(newFilter) {
    for (const key in newFilter) {
      if (this.mongoFilter.hasOwnProperty(key)) {
        // If key exists, convert to $and
        if (!this.mongoFilter.$and) {
          this.mongoFilter.$and = [];
          // Move existing conflicting key to $and
          const existing = {};
          existing[key] = this.mongoFilter[key];
          this.mongoFilter.$and.push(existing);
          delete this.mongoFilter[key];
        }
        const newCondition = {};
        newCondition[key] = newFilter[key];
        this.mongoFilter.$and.push(newCondition);
      } else {
        this.mongoFilter[key] = newFilter[key];
      }
    }
  }

  // =============================
  // 5️⃣ SORT
  // =============================
  sort() {
    if (this.queryString.sort) {
      this.sortBy = this.queryString.sort.split(",").join(" ");
    }
    return this;
  }

  // =============================
  // 6️⃣ FIELD LIMITING
  // =============================
  limitFields() {
    if (this.queryString.fields) {
      this.fields = this.queryString.fields.split(",").join(" ");
    }
    return this;
  }

  // =============================
  // 7️⃣ PAGINATION
  // =============================
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.page = page;
    this.limit = limit;
    this.skip = skip;

    return this;
  }

  // =============================
  // 8️⃣ EXECUTE QUERY
  // =============================
  async execute(Model, baseFilter = {}) {
    const finalFilter = {
      ...baseFilter,
      ...this.mongoFilter,
    };

    if (baseFilter.$and && this.mongoFilter.$and) {
      finalFilter.$and = [...baseFilter.$and, ...this.mongoFilter.$and];
    }

    console.log("=== FINAL FILTER ===");
    console.log(JSON.stringify(finalFilter, null, 2)); // Better formatting

    const query = Model.find(finalFilter)
      .sort(this.sortBy)
      .select(this.fields)
      .skip(this.skip)
      .limit(this.limit);

    const [documents, totalCount] = await Promise.all([
      query,
      Model.countDocuments(finalFilter),
    ]);

    console.log(`Found ${totalCount} documents`);

    return {
      documents,
      totalCount,
      totalPages: Math.ceil(totalCount / this.limit),
      currentPage: this.page,
      limit: this.limit,
    };
  }
}

export default APIFeatures;
