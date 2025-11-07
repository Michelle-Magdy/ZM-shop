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
import sharp from "sharp";
import { upload } from "../util/multer.config.js";
import { deleteFile } from "../util/deleteFile.js";

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
  const category = await Category.findById(req.params.id);
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
  const { id } = req.params;
  const category = await Category.findOne({ _id: id }).lean();
  const tree = await getAllSubcategories(id);
  if (!tree || !category)
    return next(
      new AppError("cannot ge the subcategories of the category", 404)
    );
  const returnCategory = {
    ...category,
    subCategories: [...tree],
  };
  res.status(200).json({
    body: returnCategory,
  });
});
export const getCategoryTree = catchAsync(async (req, res, next) => {
  const tree = await buildCategoryTree();
  if (!tree) return next(new AppError("failed to get the category tree", 500));
  res.status(200).json({
    body: tree,
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
  const id = req.params.id;
  const result = await softDeleteCategory(id);
  if (!result) return next(new AppError("cannot delete this category", 500));
  res.status(200).json(result);
});
