import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { findCategoryDescendantsIDs } from "../util/category.utils.js";

export const softDeleteCategory = async (categoryId) => {
  // 1️⃣ Get all subcategory IDs (recursively)
  const subcategoryIds = await findCategoryDescendantsIDs(categoryId);

  // Combine parent + children
  const allCategoryIds = [categoryId, ...subcategoryIds];

  // 2️⃣ Soft delete all categories
  await Category.updateMany(
    { _id: { $in: allCategoryIds } },
    { $set: { isDeleted: true } }
  );

  // 3️⃣ Unlink or soft delete all products in these categories
  await Product.updateMany(
    { categoryId: { $in: allCategoryIds } },
    { $set: { categoryId: null } }
  );

  return {
    message: "Category and subcategories deactivated successfully",
  };
};
