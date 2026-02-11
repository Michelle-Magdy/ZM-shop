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
      "variant",
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
    if (this.queryString.attributes) {
      const attributeFilters = this.queryString.attributes;

      Object.keys(attributeFilters).forEach((key) => {
        const filter = {
          attributes: {
            $elemMatch: {
              key: key,
              value: attributeFilters[key],
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
    if (this.queryString.variant) {
      const variantFilters = this.queryString.variant;
      const variantConditions = {};

      Object.keys(variantFilters).forEach((key) => {
        variantConditions[`attributeValues.${key}`] = variantFilters[key];
      });

      const filter = {
        variants: {
          $elemMatch: variantConditions,
        },
      };

      this._addToFilter(filter);
    }

    return this;
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

    // Handle $and merging if both have $and
    if (baseFilter.$and && this.mongoFilter.$and) {
      finalFilter.$and = [...baseFilter.$and, ...this.mongoFilter.$and];
    }

    const query = Model.find(finalFilter)
      .sort(this.sortBy)
      .select(this.fields)
      .skip(this.skip)
      .limit(this.limit);

    const [documents, totalCount] = await Promise.all([
      query,
      Model.countDocuments(finalFilter),
    ]);

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
