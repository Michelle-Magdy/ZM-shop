class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.filterObj = {}; // Store filter for counting
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.filterObj = JSON.parse(queryStr);
    this.query = this.query.find(this.filterObj);

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchQuery = {
        $or: [
          { title: { $regex: `^${this.queryString.search}`, $options: "i" } },
          {
            description: {
              $regex: `^${this.queryString.search}`,
              $options: "i",
            },
          },
        ],
      };
      this.query = this.query.find(searchQuery);
      // Merge with filterObj for counting
      this.filterObj = { ...this.filterObj, ...searchQuery };
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;

    return this;
  }

  // NEW: Get total count
  async getTotalCount(Model, baseFilter = {}) {
    const combinedFilter = { ...baseFilter, ...this.filterObj };
    return await Model.countDocuments(combinedFilter);
  }

  async executeAll() {
    return await this.filter().search().sort().limitFields().paginate().query;
  }
}

export default APIFeatures;

/*
// GET /api/products?category=123&filters[color]=red,blue&filters[price_min]=1000
const getFilteredProducts = async (req, res) => {
  const { 
    category, 
    page = 1, 
    limit = 20, 
    sort = 'relevance',
    ...filterParams 
  } = req.query;
  
  // Build base match stage
  const matchStage = {
    categoryIds: new mongoose.Types.ObjectId(category),
    status: 'active',
    isDeleted: false
  };
  
  // Parse filter parameters
  const variantFilters = {};  // e.g., { color: ['red'], size: ['L'] }
  const attributeFilters = {}; // e.g., { material: ['cotton'] }
  let priceMin, priceMax;
  
  Object.entries(filterParams).forEach(([key, value]) => {
    if (key.startsWith('filters[')) {
      const filterKey = key.match(/\[(.*?)\]/)[1];
      const values = value.split(',');
      
      if (['color', 'size'].includes(filterKey)) { // known variant dims
        variantFilters[filterKey] = values;
      } else {
        attributeFilters[filterKey] = values;
      }
    }
    if (key === 'price_min') priceMin = parseInt(value) * 100; // convert to cents
    if (key === 'price_max') priceMax = parseInt(value) * 100;
  });
  
  // Build aggregation pipeline
  const pipeline = [];
  
  // Stage 1: Match category and basic filters
  pipeline.push({ $match: matchStage });
  
  // Stage 2: Add computed fields for filtering
  pipeline.push({
    $addFields: {
      // Flatten variant values for matching
      variantValues: {
        $reduce: {
          input: '$variants',
          initialValue: [],
          in: {
            $concatArrays: [
              '$$value',
              [{ $objectToArray: '$$this.attributeValues' }]
            ]
          }
        }
      },
      // Calculate effective price (min variant price or base price)
      effectivePrice: {
        $cond: {
          if: { $gt: [{ $size: { $ifNull: ['$variants', []] } }, 0] },
          then: { $min: '$variants.price' },
          else: '$basePrice'
        }
      }
    }
  });
  
  // Stage 3: Price filter
  const priceMatch = {};
  if (priceMin !== undefined) priceMatch.$gte = priceMin;
  if (priceMax !== undefined) priceMatch.$lte = priceMax;
  if (Object.keys(priceMatch).length > 0) {
    pipeline.push({
      $match: { effectivePrice: priceMatch }
    });
  }
  
  // Stage 4: Variant dimension filters (e.g., color=red)
  Object.entries(variantFilters).forEach(([dim, values]) => {
    pipeline.push({
      $match: {
        [`variants.attributeValues.${dim}`]: { $in: values }
      }
    });
  });
  
  // Stage 5: Non-variant attribute filters
  Object.entries(attributeFilters).forEach(([key, values]) => {
    pipeline.push({
      $match: {
        'attributes': {
          $elemMatch: {
            key: key,
            value: { $in: values }
          }
        }
      }
    });
  });
  
  // Stage 6: Sorting
  const sortStage = {};
  switch(sort) {
    case 'price_asc': sortStage.effectivePrice = 1; break;
    case 'price_desc': sortStage.effectivePrice = -1; break;
    case 'rating': sortStage['ratingStats.average'] = -1; break;
    case 'newest': sortStage.createdAt = -1; break;
    default: sortStage.score = { $meta: 'textScore' }; // relevance
  }
  pipeline.push({ $sort: sortStage });
  
  // Stage 7: Pagination
  pipeline.push(
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) }
  );
  
  // Stage 8: Project only needed fields
  pipeline.push({
    $project: {
      title: 1,
      slug: 1,
      coverImage: 1,
      basePrice: 1,
      effectivePrice: 1,
      ratingStats: 1,
      variantDimensions: 1,
      // Include only matching variants or representative variant
      variants: {
        $filter: {
          input: '$variants',
          cond: {
            $and: Object.entries(variantFilters).map(([dim, vals]) => ({
              $in: [`$$this.attributeValues.${dim}`, vals]
            }))
          }
        }
      }
    }
  });
  
  // Execute aggregation
  const [products, countResult] = await Promise.all([
    Product.aggregate(pipeline),
    Product.aggregate([
      ...pipeline.slice(0, -3), // Remove skip, limit, project
      { $count: 'total' }
    ])
  ]);
  
  const total = countResult[0]?.total || 0;
  
  res.json({
    products,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    },
    appliedFilters: { variantFilters, attributeFilters, priceMin, priceMax }
  });
};
*/
