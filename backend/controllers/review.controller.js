import Review from "../models/review.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";
import mongoose from "mongoose";

export const productReviewSanitizer = (req, res, next) => {
  const { rating, title, description } = req.body;

  req.body = {
    productId: req.params.productId,
    rating,
    title,
    description,
    userId: req.user
  };
  next();
};

export const includeReviewParam = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const productId = mongoose.Types.ObjectId.createFromHexString(req.params.productId);
  console.log("User id: ", userId);
  console.log("Product id: ", productId);

  req.params.id = (await Review.findOne({ userId, productId }))._id; // put review id in param
  console.log("Params Id: ", req.params.id);
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
  const { productId, userId } = req.body;
  const hasReview = await Review.findOne({ userId, productId });

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

  if(!review){
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