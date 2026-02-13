import Category from "../models/category.model.js";
import AppError from "../util/appError.js";
import {
  buildCategoryTree,
  getAllSubcategories,
} from "../util/category.utils.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, updateOne } from "./factoryHandler.js";
import { softDeleteCategory } from "../services/category.service.js";
import multer from "multer";
import Product from "../models/product.model.js";
import sharp from "sharp";
import { upload } from "../util/multer.config.js";
import { deleteFile } from "../util/deleteFile.js";
import mongoose from "mongoose";

export const uploadImage = upload.single("image");

export const resizeImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = `category-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`backend/public/images/categories/${imagePath}`);
  req.body.image = imagePath;
  next();
});

export const deleteOldImage = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  let category;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    category = await Category.findById(identifier);
  } else {
    category = await Category.findOne({ slug: identifier });
  }

  if (!category) {
    if (req.body.image) deleteFile("categories", req.body.image);
    return next(new AppError("category is not found", 404));
  }
  if (category.parent && req.body.image) {
    deleteFile("categories", req.body.image);
    return next(new AppError("cannot add image to subcategory", 500));
  }

  if (req.body.image && category.image) {
    deleteFile("categories", category.image);
  }
  req.body.currentCategory = category;

  next();
});

export const getOneCategory = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  let category;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    category = await Category.findOne({
      slug: identifier,
    }).lean();
  } else {
    category = await Category.findOne({ slug: identifier }).lean();
  }

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
    parent,
    description,
  };
  if (!parent) {
    newCategory.image = image;
  } else {
    deleteFile("categories", image);
  }

  return createOne(Category, newCategory)(req, res, next);
});
export const updateCategory = updateOne(Category);
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  let result;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    result = await softDeleteCategory();
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

  console.log("filters", filters);
  res.json(filters);
});
