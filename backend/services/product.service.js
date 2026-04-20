import Product from "../models/product.model.js";
import { findCategoryDescendantsIDs } from "../util/category.utils.js";

export const getProductsByCategory = async (categoryId, filters = {}) => {
  const subcategoryIds = await findCategoryDescendantsIDs(categoryId);
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


/*
 * Decrement variant stock and recalculate default variant
 * Uses atomic operations where possible, falls back to save() for defaultVariant update
 */

export const decrementVariantStock = async (productId, sku, quantity, session) => {
  // Step 1: Atomically decrement stock if sufficient inventory exists
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      "variants.sku": sku,
      "variants.stock": { $gte: quantity }
    },
    {
      $inc: { "variants.$.stock": -quantity }
    },
    {
      session,
      new: true,
      runValidators: true
    }
  );

  if (!product) {
    throw new Error("Insufficient stock");
  }

  // Mark variants as modified to trigger your pre-save hook
  product.markModified('variants');

  // Save to trigger the defaultVariant computation in your pre-save hook
  await product.save({ session });

  return product;
};

export const restoreVariantStockAndSync = async (productId, sku, quantity, session) => {
  // Step 1: Atomically restore stock and get updated document
  const product = await Product.findOneAndUpdate(
    {
      _id: productId,
      "variants.sku": sku
      // No stock check needed for restore — we're adding back
    },
    {
      $inc: { "variants.$.stock": quantity }
    },
    {
      session,
      new: true,
      runValidators: true
    }
  );

  if (!product) {
    throw new AppError("Product or variant not found", 404);
  }

  // Step 2: Trigger defaultVariant recalculation
  product.markModified('variants');
  await product.save({ session });

  return product;
};