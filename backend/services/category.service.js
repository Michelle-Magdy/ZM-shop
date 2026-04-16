import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { findCategoryDescendantsIDs } from "../util/category.utils.js";

export const softDeleteCategory = async (categoryId) => {
  // 1️⃣ Get all subcategory IDs (recursively)
  const subcategoryIds = await findCategoryDescendantsIDs(categoryId);

  // Combine parent + children
  const allCategoryIds = [categoryId.toString(), ...subcategoryIds];

  // 2️⃣ Soft delete all categories
  await Category.updateMany(
    { _id: { $in: allCategoryIds } },
    { $set: { isDeleted: true } },
  );

  // 3️⃣ Unlink all deleted categories from products
  await Product.updateMany(
    { categoryIds: { $in: allCategoryIds } },
    { $pull: { categoryIds: { $in: allCategoryIds } } },
  );

  return {
    message: "Category and subcategories deactivated successfully",
  };
};

export const updateDescendantPaths = async (category, session) => {
  const descendants = await getAllDescendants(category._id);
  for (const descendant of descendants) {
    const path = await buildCategoryPath(descendant, category);
    await Category.findByIdAndUpdate(
      descendant._id,
      {
        namePath: path.namePath,
        slugPath: path.slugPath,
      },
      { session },
    );
  }
};

export const getAllDescendants = async (categoryId) => {
  // apply bfs
  const descendants = [];
  const queue = [categoryId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = await Category.find({
      parent: currentId,
      isDeleted: false,
    });
    descendants.push(...children);
    queue.push(...children.map((c) => c._id));
  }

  return descendants;
};

const buildCategoryPath = async (category, stopAtCategory = null) => {
  const path = {
    namePath: [category.name],
    slugPath: [category.slug],
  };

  let currentParent = category.parent;
  while (currentParent) {
    const parent = await Category.findById(currentParent);
    if (!parent) break;
    if (stopAtCategory && parent._id.equals(stopAtCategory._id)) {
      path.namePath.unshift(...parent.namePath);
      path.slugPath.unshift(...parent.slugPath);
      break;
    }
    path.namePath.unshift(parent.name);
    path.slugPath.unshift(parent.slug);

    currentParent = parent.parent;
  }

  return path;
};
