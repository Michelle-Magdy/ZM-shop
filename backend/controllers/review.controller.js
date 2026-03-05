import Review from "../models/review.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";
import Order from "../models/order.model.js";

export const productReviewSanitizer = (req, res, next) => {
  const fields = ["rating", "title", "description"];
  const sanitizedBody = {};
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      sanitizedBody[field] = req.body[field];
    }
  }
  const productId = req.params.productId;
  if (productId)
    sanitizedBody.productId = productId;

  sanitizedBody.userId = req.user._id;

  req.body = sanitizedBody;
  next();
};

export const includeReviewParam = catchAsync(async (req, res, next) => {
  req.params.id = req.params.reviewId; // put review id in param
  next();
});

export const canDeleteReview = catchAsync(async (req, res, next) => {
  const isAdmin = req.user.roles.some((role) => role.name === "admin");
  if (isAdmin) return next();

  const userId = req.user._id;
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (!review) return next(new AppError("Review not found. It may be already deleted", 404));

  if (review.userId._id.toString() !== userId.toString())
    return next(
      new AppError(
        "You are not allowed to delete another person's review",
        403,
      ),
    );

  next();
});

export const canEditReview = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  if (!review)
    return next(new AppError("Review not found. It may be already deleted", 404));
  if (review.userId._id.toString() !== userId.toString())
    return next(
      new AppError(
        "You are not allowed to edit another person's review",
        403,
      ),
    );
  next();
});

export const canAddReview = catchAsync(async (req, res, next) => {
  const { productId, userId } = req.body;
  const hasReview = await Review.findOne({ userId, productId });

  if (hasReview)
    return next(new AppError("user can only have one review", 403));

  const hasPurchased = await Order.exists({
    userId: req.user._id,
    "items.productId": productId
  });

  if (!hasPurchased)
    return next(new AppError("Please purchase this product before submitting a review.", 403));

  next();
});

// require review id in params

export const getProductReviews = (req, res, next) =>
  getAll(Review, { productId: req.params.productId })(req, res, next);

export const addProductReview = createOne(Review);

export const editProductReview = updateOne(Review);

export const deleteProductReview = deleteOne(Review);

export const handleHelpfulReview = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { reviewId } = req.params;

  let review = await Review.findOneAndUpdate(
    { _id: reviewId, helpful: userId },
    { $pull: { helpful: userId } },
    { new: true }
  );

  if (!review) {
    review = await Review.findOneAndUpdate(
      { _id: reviewId },
      { $addToSet: { helpful: userId } },
      { new: true }
    )
  };

  if (!review) {
    return res.status(404).json({
      status: "error",
      message: "Review not found. It may be deleted"
    });
  }

  res.status(200).json({
    status: "success",
    data: { review }
  });
});