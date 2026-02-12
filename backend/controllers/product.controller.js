import Product from "../models/product.model.js";
import mongoose from "mongoose";
import {
  createOne,
  updateOne,
  getAll,
  getOne,
  softDeleteOne,
} from "./factoryHandler.js";
import { upload } from "../util/multer.config.js";
import sharp from "sharp";
import catchAsync from "../util/catchAsync.js";
import { deleteFile } from "../util/deleteFile.js";
import { findCategoryDescendantsIDs } from "../util/category.utils.js";
import Category from "../models/category.model.js";
export const productSanitizer = (req, res, next) => {
  // List of allowed fields from your schema
  const allowedFields = [
    "title",
    "price",
    "olderPrice",
    "stock",
    "coverImage",
    "images",
    "avgRating",
    "nReviews",
    "description",
    "productTypeId",
    "categoryIds",
    "attributeDefinitions",
    "attributes",
    "variantDimensions",
    "variants",
    "slug",
    "isDeleted",
    "isBestSeller",
    "isFeatured",
    "vendorId",
    "ratingStats",
    "viewCount",
    "salesCount",
    "status",
  ];

  // Filter req.body to only include allowed fields
  const sanitizedBody = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      sanitizedBody[field] = req.body[field];
    }
  });

  req.body = sanitizedBody;
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
    }),
  );
  req.body.images = images;
  next();
});

export const deleteOldImagesOnUpdate = catchAsync(async (req, res, next) => {
  const productId = req.params.id;

  // 1. Get the current product data
  const product = await Product.findById(productId).select(
    "+coverImage +images",
  );

  if (!product) {
    // If product not found, clean up any newly uploaded files
    if (req.body.coverImage) deleteFile("products", req.body.coverImage);

    if (req.body.images) {
      req.body.images.forEach((imageName) => {
        deleteFile("products", imageName);
      });
    }
    return next(new Error("No product found with that ID"));
  }

  // 2. Check for new coverImage and delete old one if present
  if (req.body.coverImage && product.coverImage) {
    // req.body.coverImage will be set by resizeImages if a new file was uploaded
    deleteFile("products", product.coverImage);
  }

  if (
    req.body.images &&
    req.body.images.length > 0 &&
    product.images.length > 0
  ) {
    product.images.forEach((imageName) => {
      deleteFile("products", imageName);
    });
  }

  next();
});

export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = softDeleteOne(Product);
export const getProduct = getOne(Product, null, [
  { path: "vendorId", select: "name" },
]);
export const getAllProducts = getAll(Product);

export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  let category;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    category = await Category.findOne({ _id: identifier, isDeleted: false });
  } else {
    category = await Category.findOne({ slug: identifier, isDeleted: false });
  }

  if (!category) {
    return next(new Error("Category not found", 404));
  }
  const allCategories = await findCategoryDescendantsIDs(category._id);
  allCategories.push(category._id);

  const filter = {
    isDeleted: false,
    categoryIds: { $in: allCategories },
  };

  return getAll(Product, filter)(req, res, next);
});

export const getBestSellerProducts = catchAsync(async (req, res, next) => {
  const bestSellers = await Product.find({ isBestSeller: true });
  res.json({ data: bestSellers });
});

export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const featured = await Product.find({ isFeatured: true });
  res.json({ data: featured });
});

export const getTopDiscounts = catchAsync(async (req, res, next) => {
  const products = await Product.aggregate([
    {
      $match: {
        $expr: { $gt: ["$olderPrice", "$price"] },
      },
    },
    {
      $addFields: {
        discountPercentage: {
          $round: [
            {
              $multiply: [
                {
                  $divide: [
                    { $subtract: ["$olderPrice", "$price"] },
                    "$olderPrice",
                  ],
                },
                100,
              ],
            },
            2,
          ],
        },
      },
    },
    {
      $sort: { discountPercentage: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: products,
  });
});
