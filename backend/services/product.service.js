import Product from "../models/Product.js";
import { findCategoryDescendants } from "../utils/findCategoryDescendants.js";

export const getProductsByCategory = async (categoryId, filters = {}) => {
  const subcategoryIds = await findCategoryDescendants(categoryId);
  const allCategoryIds = [categoryId, ...subcategoryIds];

  const query = {
    isDeleted: false,
    category: { $in: allCategoryIds },
    ...filters,
  };

  const products = await Product.find(query)
    .populate("category", "name") // optional: show category name
    .lean();

  return products;
};
