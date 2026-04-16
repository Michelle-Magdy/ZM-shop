import AppError from "../util/appError.js";
import Category from "../models/category.model.js";
export const validateCategoryUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { parent, name } = req.body;

  // find category
  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // check for circular reference
  if (parent) {
    if (parent === id) {
      return next(new AppError("Category cannot be its own parent", 400));
    }
    // check if new parent is a descendant of current category
    const isDescendant = await checkIfDescendant(id, parent);
    if (isDescendant) {
      return next(
        new AppError(
          "Cannot set a descendant as parent (circular reference",
          400,
        ),
      );
    }
  }

  // check name uniqueness within same parent
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name,
      parent: parent || category.parent,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (existingCategory) {
      return next(
        new AppError(`Category with name ${name} already exists at this level`),
        400,
      );
    }
  }
  req.currentCategory = category;
  next();
};

const checkIfDescendant = async (parentId, childId) => {
  const children = await Category.find({ parent: parentId, isDeleted: false });
  for (const child of children) {
    if (child._id.toString() === childId) return true;
    if (await checkIfDescendant(child._id, childId)) return true;
  }
  return false;
};
