import mongoose from "mongoose";

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
    this.populateOptions = null;
    this.extraSelections = null;
  }

  // =============================
  // 1️⃣ BASIC + RANGE FILTERS
  // =============================
  filter() {
    const queryObj = { ...this.queryString };
    const parsedQuery = {};

    for (const key in queryObj) {
      const value = queryObj[key];
      const bracketMatch = key.match(/^(.+)\[(.+)\]$/);

      if (bracketMatch) {
        const [, field, operator] = bracketMatch;
        if (!parsedQuery[field]) parsedQuery[field] = {};
        parsedQuery[field][operator] = value;
      } else {
        parsedQuery[key] = value;
      }
    }

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

    let queryStr = JSON.stringify(parsedQuery);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let parsed = JSON.parse(queryStr);

    const convertTypes = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          convertTypes(obj[key]);
        } else if (!isNaN(obj[key]) && obj[key] !== "" && obj[key] !== null) {
          obj[key] = Number(obj[key]);
        } else if (obj[key] === "true") {
          obj[key] = true;
        } else if (obj[key] === "false") {
          obj[key] = false;
        } else if (mongoose.Types.ObjectId.isValid(obj[key])) {
          obj[key] = new mongoose.Types.ObjectId(obj[key]);
        }
      }
    };

    convertTypes(parsed);
    this.mongoFilter = { ...this.mongoFilter, ...parsed };

    return this;
  }

  // =============================
  // 2️⃣ SEARCH
  // =============================
  search(searchFields) {
    if (this.queryString.search) {
      const searchQuery = !searchFields
        ? {
            //Default title and description
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
          }
        : {
            $or: searchFields.map((field) => ({
              [field]: {
                $regex: this.queryString.search,
                $options: "i",
              },
            })),
          };

      this._addToFilter(searchQuery);
    }

    return this;
  }

  // =============================
  // 3️⃣ ATTRIBUTE FILTERS (Unchanged - works on product.attributes array)
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
                { value: rawValue },
                ...(isNumber ? [{ value: numValue }] : []),
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
  // 4️⃣ VARIANT FILTERS - FIXED for Map structure
  // =============================
  variants() {
    if (!this.queryString) return this;

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
        possibleValues.push(rawValue);
        possibleValues.push(rawValue.toLowerCase());
        possibleValues.push(rawValue.toUpperCase());
        possibleValues.push(
          rawValue.charAt(0).toUpperCase() + rawValue.slice(1).toLowerCase(),
        );

        const numValue = Number(rawValue);
        if (!isNaN(numValue) && rawValue !== "") {
          possibleValues.push(numValue);
        }
      });
      return [...new Set(possibleValues)];
    };

    // FIXED: Build MongoDB filter for Map structure
    // Map in MongoDB is stored as: { "attributeValues.color": "Red", "attributeValues.size": "XL" }
    const andConditions = filterKeys.map((key) => {
      const values = buildPossibleValues(filters[key]);
      return {
        [`attributeValues.${key}`]:
          values.length === 1 ? values[0] : { $in: values },
      };
    });

    let variantFilter;
    if (andConditions.length === 1) {
      variantFilter = {
        variants: {
          $elemMatch: {
            ...andConditions[0],
            isActive: true,
          },
        },
      };
    } else {
      variantFilter = {
        variants: {
          $elemMatch: {
            $and: andConditions,
            isActive: true,
          },
        },
      };
    }

    this._addToFilter(variantFilter);
    return this;
  }

  // =============================
  // HELPER: Merge filters without overwriting
  // =============================
  _addToFilter(newFilter) {
    for (const key in newFilter) {
      if (this.mongoFilter.hasOwnProperty(key)) {
        if (!this.mongoFilter.$and) {
          this.mongoFilter.$and = [];
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
  // 8️⃣ POPULATE FIELDS
  // =============================

  populate(fields) {
    if (fields && fields.length > 0) {
      this.populateOptions = fields;
    }
    return this;
  }

  // =============================
  // 9️⃣SELECT FIELDS
  // =============================
  //must be called after limitFields to avoid being overridden
  extraSelect(fields) {
    if (fields) {
      this.extraSelections = fields;
    }
    return this;
  }

  // =============================
  // 🔟 EXECUTE QUERY
  // =============================
  async execute(Model, baseFilter = {}) {
    const { bypassDeletedFilter, ...actualFilter } = baseFilter;
    const finalFilter = {
      ...actualFilter,
      ...this.mongoFilter,
    };

    if (baseFilter.$and && this.mongoFilter.$and) {
      finalFilter.$and = [...baseFilter.$and, ...this.mongoFilter.$and];
    }

    let selectFields = this.fields;
    if (this.extraSelections) {
      if (this.fields) selectFields = `${this.fields} ${this.extraSelections}`;
      else selectFields = this.extraSelections;
    }

    let query = Model.find(finalFilter, null, {
      bypassDeletedFilter: bypassDeletedFilter || false,
    })
      .collation({ locale: "en", strength: 1 })
      .sort(this.sortBy)
      .select(selectFields)
      .skip(this.skip)
      .limit(this.limit);

    if (this.populateOptions) {
      this.populateOptions.forEach((option) => {
        query.populate(option[0], option[1]);
      });
    }

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
