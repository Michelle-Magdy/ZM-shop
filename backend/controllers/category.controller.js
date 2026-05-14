import Category from "../models/category.model.js";
import AppError from "../util/appError.js";
import {
  buildCategoryTree,
  getAllSubcategories,
} from "../util/category.utils.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, updateOne } from "./factoryHandler.js";
import {
  softDeleteCategory,
  updateDescendantPaths,
} from "../services/category.service.js";
import Product from "../models/product.model.js";
import sharp from "sharp";
import { upload } from "../config/multer.config.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../config/cloudinary.config.js";
import mongoose from "mongoose";

export const uploadImage = upload.single("image");

export const resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Resize in memory, then upload to Cloudinary
  const resizedBuffer = await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const result = await uploadToCloudinary(resizedBuffer, {
    folder: "zm-shop/categories",
    public_id: `category-${Date.now()}`,
    format: "jpeg",
  });

  req.body.image = result.secure_url;
  next();
});

export const deleteOldImage = catchAsync(async (req, res, next) => {
  const category = req.currentCategory;

  if (!category) {
    if (req.body.image) {
      const publicId = extractPublicId(req.body.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    return next(new AppError("category not found", 404));
  }

  const parentIsBeingSet =
    req.body.parent !== undefined &&
    req.body.parent !== null &&
    req.body.parent !== "";

  // Uploading an image onto a subcategory is not allowed
  if (parentIsBeingSet && req.body.image) {
    const publicId = extractPublicId(req.body.image);
    if (publicId) await deleteFromCloudinary(publicId);
    return next(new AppError("cannot add image to subcategory", 400));
  }

  // Category already is a subcategory and has an image — clear it
  if (category.parent && category.image) {
    const publicId = extractPublicId(category.image);
    if (publicId) await deleteFromCloudinary(publicId);
    req.body.image = "";
  }

  // A new image replaces the old one — delete the old one
  if (req.body.image && category.image && req.body.image !== category.image) {
    const publicId = extractPublicId(category.image);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  // Category is being moved under a parent and currently has an image — clear it
  if (parentIsBeingSet && category.image) {
    const publicId = extractPublicId(category.image);
    if (publicId) await deleteFromCloudinary(publicId);
    req.body.image = "";
  }

  next();
});


export const getOneCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let category;
  if (mongoose.Types.ObjectId.isValid(id)) {
    category = await Category.findOne({
      _id: id,
    }).lean();
  } else {
    category = await Category.findOne({ slug: id }).lean();
  }
  if (!category) throw new AppError("cannot find this category", 404);

  const tree = await getAllSubcategories(category._id);
  if (!tree || !category)
    return next(
      new AppError("cannot ge the subcategories of the category", 404),
    );
  const returnCategory = {
    ...category,
    subCategories: [...tree],
  };
  res.status(200).json({
    data: returnCategory,
  });
});

export const getCategoryTree = catchAsync(async (req, res, next) => {
  const tree = await buildCategoryTree();
  if (!tree) return next(new AppError("failed to get the category tree", 500));
  res.status(200).json({
    data: tree,
  });
});

export const createCategory = catchAsync(async (req, res, next) => {
  const { name, parent, description, image } = req.body;
  const newCategory = {
    name,
    parent: parent && parent !== "" ? parent : null,
    description,
  };
  if (!parent) {
    newCategory.image = image;
  } else if (image) {
    // Subcategories shouldn't have images — delete the uploaded one
    const publicId = extractPublicId(image);
    if (publicId) await deleteFromCloudinary(publicId);
  }

  return createOne(Category, newCategory)(req, res, next);
});

export const updateCategoryHandler = async (req, res, next) => {
  const { id } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const category = req.currentCategory;
    const oldParent = category.parent;
    const newParent =
      req.body.parent !== undefined
        ? req.body.parent === "" || req.body.parent === null
          ? null
          : req.body.parent
        : oldParent;
    const oldName = category.name;
    const newName = req.body.name !== undefined ? req.body.name : oldName;

    const parentChanged = String(oldParent) !== String(newParent);

    // Bug 6 fixed: pass { session } so the write is part of the transaction
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        parent: newParent,
        name: newName,
        description: req.body.description,
        image: req.body.image,
      },
      { new: true, runValidators: true, session },
    );

    if (parentChanged || newName !== oldName) {
      await updateDescendantPaths(updatedCategory, session);
    }

    await session.commitTransaction();

    res.status(200).json({
      message: "updated category successfully!",
      data: updatedCategory,
    });
  } catch (err) {
    await session.abortTransaction();
    // Also clean up the newly uploaded file from Cloudinary if the DB write failed
    if (req.body.image) {
      const publicId = extractPublicId(req.body.image);
      if (publicId) await deleteFromCloudinary(publicId);
    }
    next(err);
  } finally {
    session.endSession();
  }
};
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let result;
  if (mongoose.Types.ObjectId.isValid(id)) {
    result = await softDeleteCategory(id);
  }
  if (!result) return next(new AppError("cannot delete this category", 500));
  res.status(200).json(result);
});
export const getAvailableFilters = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const products = await Product.find({
    categoryIds: { $in: [categoryId] },
    status: "active",
    isDeleted: false,
  });

  if (!products) return next(new AppError("there are no products", 404));

  const filters = {
    price: { type: "range", min: Infinity, max: -Infinity },
    attributes: {},
    variants: {},
  };

  // Handle empty products case
  if (products.length === 0) {
    filters.price.min = 0;
    filters.price.max = 0;
    return res.json(filters);
  }

  products.forEach((product) => {
    // Price range
    const range = product.priceRange;
    console.log(range);
    filters.price.min = Math.min(filters.price.min, range.min);
    filters.price.max = Math.max(filters.price.max, range.max);

    // Non-variant attributes
    product.attributeDefinitions
      .filter((def) => !def.isvariantDimensions && def.isFilterable)
      .forEach((def) => {
        const attr = product.attributes.find((a) => a.key === def.key);
        if (!attr) return;

        if (!filters.attributes[def.key]) {
          filters.attributes[def.key] = {
            key: def.key,
            displayName: def.displayName || def.key,
            type: def.type,
            options: new Set(),
          };
        }
        filters.attributes[def.key].options.add(String(attr.value));
      });

    // Variant attributes - FIXED for Map structure
    product.attributeDefinitions
      .filter((def) => def.isvariantDimensions && def.isFilterable)
      .forEach((def) => {
        if (!filters.variants[def.key]) {
          filters.variants[def.key] = {
            key: def.key,
            displayName: def.displayName || def.key,
            type: def.type,
            options: new Set(),
          };
        }

        // FIXED: Iterate through variants and check Map entries
        product.variants.forEach((variant) => {
          // attributeValues is a Map, use .get() or convert to object
          const value = variant.attributeValues.get(def.key);
          if (value !== undefined) {
            filters.variants[def.key].options.add(String(value));
          }
        });
      });
  });

  // Convert Sets to Arrays
  Object.values(filters.attributes).forEach(
    (attr) => (attr.options = [...attr.options]),
  );
  Object.values(filters.variants).forEach(
    (attr) => (attr.options = [...attr.options]),
  );

  res.json(filters);
});

export const getCategoryStats = catchAsync(async (req, res, next) => {
  const stats = await Category.aggregate([
    {
      $facet: {
        totalCategories: [
          { $match: { isDeleted: false } },
          { $count: "count" },
        ],
        rootCategories: [
          {
            $match: {
              isDeleted: false,
              parent: null,
            },
          },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        totalCategories: {
          $ifNull: [{ $arrayElemAt: ["$totalCategories.count", 0] }, 0],
        },
        rootCategories: {
          $ifNull: [{ $arrayElemAt: ["$rootCategories.count", 0] }, 0],
        },
      },
    },
  ]);

  return res.status(200).json({ message: "category stats", stats });
});
