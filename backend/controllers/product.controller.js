import Product from "../models/product.model.js";
import mongoose from "mongoose";
import {
  createOne,
  updateOne,
  getAll,
  getOne,
  softDeleteOne,
} from "./factoryHandler.js";
import { upload } from "../config/multer.config.js";
import sharp from "sharp";
import catchAsync from "../util/catchAsync.js";
import { deleteFile } from "../util/deleteFile.js";
import { findCategoryDescendantsIDs } from "../util/category.utils.js";
import Category from "../models/category.model.js";
import AppError from "../util/appError.js";

const safeJsonParse = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeToArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return [];
  }

  if (typeof value === "string") {
    const parsed = safeJsonParse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [value];
  }

  return [value];
};

const uniqueStrings = (values = []) => [...new Set(values)];

export const productSanitizer = (req, res, next) => {
  try {
    // If using old nested approach: req.body.data contains JSON
    // If using new flat approach: req.body already has flat fields from multer
    const sourceBody = req.body?.data ? safeJsonParse(req.body.data) : req.body;
    const normalizedBody = { ...(sourceBody || {}) };

    // === 1. Parse JSON string fields ===
    const jsonFields = [
      "categoryIds",
      "attributeDefinitions",
      "attributes",
      "variantDimensions",
      "variants",
      "defaultVariant",
      "ratingStats",
      "existingImages", // ← ADDED: frontend sends this as JSON string
    ];

    jsonFields.forEach((field) => {
      if (typeof normalizedBody[field] === "string") {
        normalizedBody[field] = safeJsonParse(normalizedBody[field]);
      }
    });

    // === 2. Ensure arrays are actually arrays ===
    const arrayFields = [
      "images",
      "categoryIds",
      "variantDimensions",
      "attributeDefinitions",
      "attributes",
      "variants",
      "existingImages", // ← ADDED
    ];

    arrayFields.forEach((field) => {
      if (normalizedBody[field] && !Array.isArray(normalizedBody[field])) {
        if (typeof normalizedBody[field] === "string") {
          const parsed = safeJsonParse(normalizedBody[field]);
          if (Array.isArray(parsed)) {
            normalizedBody[field] = parsed;
          }
        } else if (normalizedBody[field]) {
          normalizedBody[field] = [normalizedBody[field]];
        }
      }
    });

    // === 3. Handle number fields ===
    const numberFields = [
      "price",
      "olderPrice",
      "stock",
      "avgRating",
      "nReviews",
      "viewCount",
      "salesCount",
    ];

    numberFields.forEach((field) => {
      if (normalizedBody[field] === "" || normalizedBody[field] === null) {
        normalizedBody[field] = null;
        return;
      }

      if (normalizedBody[field] !== undefined) {
        const numericValue = Number(normalizedBody[field]);
        if (Number.isNaN(numericValue)) {
          throw new AppError(`Invalid number value for ${field}`, 400);
        } else {
          normalizedBody[field] = numericValue;
        }
      }
    });

    // === 4. Handle boolean fields ===
    const booleanFields = ["isDeleted", "isBestSeller", "isFeatured"];
    booleanFields.forEach((field) => {
      if (typeof normalizedBody[field] === "string") {
        normalizedBody[field] = normalizedBody[field] === "true";
      }
      // Already boolean? Leave as-is
    });

    // === 5. Handle multer files — MERGE with existing images ===
    // Multer puts: single file in req.file, multiple in req.files (array or object)

    // Keep any resized/stored filename already set by previous middleware.
    // If missing, try to derive it from uploaded files.
    if (
      typeof normalizedBody.coverImage === "string" &&
      normalizedBody.coverImage
    ) {
      // keep as-is (could be URL or local filename like product-*.jpeg)
    } else if (req.file && req.file.fieldname === "coverImage") {
      // Single upload middleware was used for cover
      normalizedBody.coverImage =
        req.file.path || req.file.location || req.file.filename || null;
    } else if (req.files?.coverImage?.[0]) {
      // .fields() middleware shape
      const coverFile = req.files.coverImage[0];
      normalizedBody.coverImage =
        coverFile.path || coverFile.location || coverFile.filename || null;
    }

    // Handle gallery images: merge existing URLs + new uploaded files
    const uploadedImages = [];
    if (normalizedBody.images) {
      if (req.files) {
        // Multer .array() or .fields() was used
        if (Array.isArray(req.files)) {
          // .array('images') — all files in one array
          uploadedImages.push(
            ...req.files
              .filter((f) => f.fieldname === "images")
              .map((f) => f.path || f.location || f.filename),
          );
        } else if (typeof req.files === "object") {
          // .fields([...]) — files grouped by fieldname
          if (req.files.images) {
            uploadedImages.push(
              ...req.files.images.map(
                (f) => f.path || f.location || f.filename,
              ),
            );
          }
        }
      }

      // Preserve filenames already set by resize middleware, then merge with
      // existing image URLs and any uploaded file paths that can be resolved.
      const resizedImages = normalizeToArray(normalizedBody.images).filter(
        (image) => typeof image === "string" && image,
      );

      // Merge: existing image URLs + newly uploaded file paths + resized names
      const existingImageUrls = Array.isArray(normalizedBody.existingImages)
        ? normalizedBody.existingImages
        : [];

      normalizedBody.images = [
        ...existingImageUrls,
        ...resizedImages,
        ...uploadedImages,
      ].filter((image) => typeof image === "string" && image);
      normalizedBody.images = uniqueStrings(normalizedBody.images);

      // === 6. Clean up temporary fields not in schema ===
      delete normalizedBody.existingImages; // internal field, not in schema
    }

    // === 7. Filter to allowed fields only ===
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
      "defaultVariant",
    ];

    const sanitizedBody = {};
    allowedFields.forEach((field) => {
      if (normalizedBody[field] !== undefined) {
        sanitizedBody[field] = normalizedBody[field];
      }
    });

    req.body = sanitizedBody;

    next();
  } catch (error) {
    return next(error);
  }
};

export const uploadImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export const resizeImages = catchAsync(async (req, res, next) => {
  const existingImages = normalizeToArray(req.body?.existingImages).filter(
    (image) => typeof image === "string" && image,
  );

  const uploadedImages = [];

  if (req.files?.coverImage) {
    const coverImageName = `product-${Date.now()}-cover.jpeg`;

    await sharp(req.files.coverImage[0].buffer)
      .resize(1000, 1000)
      .toFormat("jpeg")
      .jpeg({
        quality: 90,
      })
      .toFile(`backend/public/images/products/${coverImageName}`);
    req.body.coverImage = coverImageName;
  }

  if (req.files?.images) {
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
        uploadedImages.push(imageName);
      }),
    );
  }

  const mergedImages = [...existingImages, ...uploadedImages];
  if (mergedImages.length > 5) {
    uploadedImages.forEach((imageName) => deleteFile("products", imageName));
    return next(new AppError("Each Product can have only 5 images", 400));
  }

  if (mergedImages.length > 0) {
    req.body.images = mergedImages;
  }

  next();
});

export const deleteOldImagesOnUpdate = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  let filter;

  if (mongoose.Types.ObjectId.isValid(slug)) {
    filter = { _id: slug };
  } else {
    filter = { slug: slug };
  }
  // 1. Get current product
  const product = await Product.findOne(filter).select("+coverImage +images");

  // Clean up newly uploaded files if product not found
  if (!product) {
    if (req.body.coverImage) deleteFile("products", req.body.coverImage);
    if (Array.isArray(req.body.images)) {
      req.body.images.forEach((imageName) => deleteFile("products", imageName));
    }
    return next(new AppError("Product not found", 404));
  }

  // 2. Delete old cover image if new one uploaded
  if (
    req.body.coverImage &&
    product?.coverImage &&
    req.body.coverImage !== product.coverImage
  ) {
    deleteFile("products", product.coverImage);
  }

  // 3. Validate total gallery images and remove dropped old images
  if (Array.isArray(req.body.images) && req.body.images.length > 5) {
    req.body.images.forEach((imageName) => deleteFile("products", imageName));
    return next(new AppError("Each Product can have only 5 images", 400));
  }

  if (Array.isArray(req.body.images)) {
    const nextImages = new Set(req.body.images);
    (product.images || []).forEach((oldImage) => {
      if (!nextImages.has(oldImage)) {
        deleteFile("products", oldImage);
      }
    });
  }

  next();
});

export const createProduct = createOne(Product);
export const updateProduct = updateOne(Product);
export const deleteProduct = softDeleteOne(Product);
export const getProduct = getOne(Product, null, [
  { path: "vendorId", select: "name" },
  // { path: "categoryIds", select: "name" },
]);
export const getAllProducts = getAll(Product);

export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { identifier } = req.params;
  if (identifier === "all")
    return getAll(Product, { isDeleted: false })(req, res, next);
  if (identifier === "none")
    return getAll(Product, { isDeleted: false, categoryIds: [] })(
      req,
      res,
      next,
    );

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

export const bulkUpdateProductsHandler = catchAsync(async (req, res, next) => {
  const { slugs, updates } = req.body;
  if (!slugs || slugs.length <= 0) {
    return new AppError("slugs array required", 400);
  }

  if (!updates || typeof updates !== "object") {
    return new AppError("updates object required", 400);
  }

  const result = await Product.updateMany(
    {
      slug: { $in: slugs },
    },
    { $set: updates, updatedAt: new Date() },
  );

  return res.json({
    success: true,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  });
});

export const bulkDeleteProductsHandler = catchAsync(async (req, res, next) => {
  const { slugs } = req.body;
  if (!slugs || slugs.length <= 0) {
    return new AppError("slugs array required", 400);
  }
  const result = await Product.updateMany(
    {
      slug: { $in: slugs },
    },
    { $set: { isDeleted: ture }, updatedAt: new Date() },
  );

  return res.json({
    success: true,
    modifiedCount: result.modifiedCount,
    matchedCount: result.matchedCount,
  });
});
export const getStats = catchAsync(async (req, res) => {
  const [
    totalStats,
    activeCount,
    lowStockCount,
    featuredCount,
    totalSalesCount,
    avgRating,
  ] = await Promise.all([
    // Total products
    Product.countDocuments({ isDeleted: false }),

    // Active products
    Product.countDocuments({ status: "active", isDeleted: false }),

    // Low stock (main stock OR any variant stock <= 5)
    Product.countDocuments({
      isDeleted: false,
      $or: [{ stock: { $lte: 5 } }, { "variants.stock": { $lte: 5 } }],
    }),

    // Featured products
    Product.countDocuments({ isDeleted: false, isFeatured: true }),

    // ✅ Total product sales (from product.salesCount)
    Product.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$salesCount" } } },
    ]),

    // Average rating (only products with ratings)
    Product.aggregate([
      {
        $match: {
          isDeleted: false,
          "ratingStats.count": { $gt: 0 }, // ✅ Only rated products
        },
      },
      { $group: { _id: null, avg: { $avg: "$ratingStats.average" } } },
    ]),
  ]);

  res.json({
    status: "success",
    data: {
      total: totalStats,
      active: activeCount,
      lowStock: lowStockCount,
      featured: featuredCount,
      totalSales: totalSalesCount[0]?.total || 0, // Product units sold
      avgRating: avgRating[0]?.avg?.toFixed(1) || "0.0",
    },
  });
});
