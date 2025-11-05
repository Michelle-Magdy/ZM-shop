import Product from "../models/product.model.js";
import {
  createOne,
  updateOne,
  getAll,
  getOne,
  softDeleteOne,
} from "./factoryHandler.js";
import { upload } from "../util/multer.config.js";
import multer from "multer";
import sharp from "sharp";
import catchAsync from "../util/catchAsync.js";

export const productSanitizer = (req, res, next) => {
  console.log(req.body);

  const {
    title,
    price,
    stock,
    description,
    coverImage,
    images,
    productTypeId,
    attributes,
    categoryId,
    slug,
    isDeleted,
    nReviews,
    avgRating,
  } = req.body;
  req.body = {
    title,
    price,
    stock,
    description,
    coverImage,
    images,
    productTypeId,
    attributes,
    categoryId,
    slug,
    isDeleted,
    nReviews,
    avgRating,
  };
  next();
};
export const uploadImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.images || !req.files.coverImage) {
    return next();
  }

  const coverImageName = `product-${Date.now()}-cover.jpeg`;

  await sharp(req.files.coverImage[0].buffer)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`backend/public/images/products/${coverImageName}`);
  req.body.coverImage = coverImageName;
  let images = [];
  await Promise.all(
    req.files.images.map(async (image, index) => {
      const imageName = `product-${Date.now()}-${index}.jpeg`;

      await sharp(image.buffer)
        .resize(900, 900)
        .toFormat("jpeg")
        .jpeg({
          quality: 90,
        })
        .toFile(`backend/public/images/products/${imageName}`);
      images.push(imageName);
    })
  );
  req.body.images = images;
  next();
});

export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = softDeleteOne(Product);
export const getProduct = getOne(Product);
export const getAllProducts = getAll(Product);
