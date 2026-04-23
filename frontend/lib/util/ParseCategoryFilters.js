/**
 * Parses Next.js searchParams into a structured filters object
 * Works identically on Server and Client
 */
export function parseCategoryFilters(searchParams, filtersData = null) {
  // Handle both Next.js searchParams (object) and URLSearchParams
  const get = (key) => {
    if (typeof searchParams.get === "function") {
      return searchParams.get(key);
    }
    return searchParams[key];
  };

  const filters = {
    sort: get("sort") || "title",
    price: {
      min: filtersData?.price?.min ?? 0,
      max: filtersData?.price?.max ?? Infinity,
    },
    attributes: {},
    variants: {},
    status: "active",
  };

  // Parse price range
  const minPrice = get("defaultVariant.price[gte]");
  const maxPrice = get("defaultVariant.price[lte]");
  if (minPrice !== undefined && minPrice !== null) {
    filters.price.min = parseInt(minPrice, 10);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    filters.price.max = parseInt(maxPrice, 10);
  }

  // Parse attributes[color]=red,blue
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof searchParams.get === "function") return; // URLSearchParams handles in loop below

    const attrMatch = key.match(/^attributes\[(.+)\]$/);
    if (attrMatch && value) {
      filters.attributes[attrMatch[1]] =
        typeof value === "string" ? value.split(",") : value;
    }

    const varMatch = key.match(/^variants\[(.+)\]$/);
    if (varMatch && value) {
      filters.variants[varMatch[1]] =
        typeof value === "string" ? value.split(",") : value;
    }
  });

  // For URLSearchParams object
  if (typeof searchParams.get === "function") {
    searchParams.forEach((value, key) => {
      const attrMatch = key.match(/^attributes\[(.+)\]$/);
      if (attrMatch) {
        filters.attributes[attrMatch[1]] = value.split(",");
      }

      const varMatch = key.match(/^variants\[(.+)\]$/);
      if (varMatch) {
        filters.variants[varMatch[1]] = value.split(",");
      }
    });
  }

  return filters;
}

/**
 * Converts filters object back to URLSearchParams string
 */
export function filtersToSearchParams(filters) {
  const params = new URLSearchParams();

  if (filters.sort && filters.sort !== "title") {
    params.set("sort", filters.sort);
  }

  if (filters.price) {
    params.set("defaultVariant.price[gte]", filters.price.min.toString());
    params.set("defaultVariant.price[lte]", filters.price.max.toString());
  }

  Object.entries(filters.attributes || {}).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(`attributes[${key}]`, values.join(","));
    }
  });

  Object.entries(filters.variants || {}).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(`variants[${key}]`, values.join(","));
    }
  });

  return params.toString();
}
