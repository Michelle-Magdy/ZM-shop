import Review from "../models/review.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";
import mongoose from "mongoose";

export const productReviewSanitizer = (req, res, next) => {
  const { userId, rating, title, description } = req.body;

  req.body = {
    productId: req.params.productId,
    userId,
    rating,
    title,
    description,
  };
  next();
};

export const includeReviewParam = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  req.params.id = await Review.findOne({ userId, productId }).select("_id"); // put review id in param

  next();
});

export const canDeleteReview = catchAsync(async (req, res, next) => {
  const isAdmin = req.user.roles.some((role) => role.name === "admin");
  if (isAdmin) return next();

  const userId = req.user._id;
  const productId = req.params.productId;

  const review = await Review.findOne({ userId, productId });
  if (!review)
    return next(
      new AppError(
        "You are not allowed to delete another person's review",
        403,
      ),
    );

  next();
});

export const canAddReview = catchAsync(async (req, res, next) => {
  const { userId, productId } = req.body;

  const hasReview = await Review.findOne({ userId, productId });
  //   const hasBought = awai;
  //! add has Bought
  if (hasReview)
    return next(new AppError("user can only have one review", 403));

  next();
});

// require review id in params

export const getProductReviews = (req, res, next) =>
  getAll(Review, { productId: req.params.productId })(req, res, next);

export const addProductReview = createOne(Review);

export const editProductReview = updateOne(Review);

export const deleteProductReview = deleteOne(Review);

export const getProductStats = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const objectId =
    typeof productId === "string"
      ? mongoose.Types.ObjectId.createFromHexString(productId)
      : productId;

  const stats = await Review.aggregate([
    {
      $match: { productId: objectId },
    },
    {
      $group: {
        _id: { $round: ["$rating", 0] },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const totalRatings = stats.reduce((sum, curr) => sum + curr.count, 0);

  const result = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const match = stats.find((r) => r._id === rating);
    const count = match ? match.count : 0;

    return {
      rating,
      count,
      percent: totalRatings ? Math.round((count / totalRatings) * 100) : 0,
    };
  });

  res.status(200).json({
    status: "success",
    stats: result,
  });
});
