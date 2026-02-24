import Wishlist from "../models/wishlist.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";

export const wishlistSanitizar = (req, res, next) => {
  if (!Array.isArray(req.body.items)) {
    return next(new AppError("Items must be an array", 400));
  }

  req.body.items = req.body.items.map(item => {
    const {
      productId,
      slug,
      title,
      coverImage,
      variant
    } = item;

    // Validate required fields
    if (!productId) {
      throw new AppError("productId is required for each item", 400);
    }
    if (!title) {
      throw new AppError("title is required for each item", 400);
    }
    if (!coverImage) {
      throw new AppError("coverImage is required for each item", 400);
    }

    // Build sanitized variant object
    let sanitizedVariant;
    if (variant) {
      // Handle attributeValues Map conversion
      let attributeValues = new Map();
      if (variant.attributeValues) {
        if (variant.attributeValues instanceof Map) {
          attributeValues = variant.attributeValues;
        } else if (typeof variant.attributeValues === 'object') {
          attributeValues = new Map(Object.entries(variant.attributeValues));
        }
      }

      sanitizedVariant = {
        sku: variant.sku || undefined,
        attributeValues,
        price: variant.price !== undefined ? Number(variant.price) : undefined,
        stock: variant.stock !== undefined ? Number(variant.stock) : 0,
        isActive: variant.isActive !== undefined ? Boolean(variant.isActive) : true
      };
    }

    return {
      productId,
      slug: slug || undefined,
      title,
      coverImage,
      ...(sanitizedVariant && { variant: sanitizedVariant })
    };
  });

  next();
};

export const getWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) //probably won't happen as every user has a wishlist
    return next(new AppError("No wishlist for current user", 404));

  res.status(200).json({
    status: "success",
    items: wishlist.items
  });
});

export const updateWishlist = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist)
    return next(new AppError("No wishlist for current user", 404)); //won't happen every user has a wishlist


  wishlist.items = req.body.items;
  await wishlist.save();

  res.status(200).json({
    status: "success",
    items: wishlist.items
  });
})

