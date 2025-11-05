import Review from "../models/review.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";

export const productReviewSanitizer = (req, res, next) => {
    const {
        userId,
        userName,
        rating,
        title,
        description
    } = req.body;

    req.body = {
        productId: req.params.productId,
        userId,
        userName,
        rating,
        title,
        description
    }
    next();
}

export const includeReviewParam = catchAsync( async (req, res, next) => {
    const userId = req.user._id;
    const productId = req.params.productId;

    req.params.id = await Review.findOne({userId, productId}).select('_id'); // put review id in param

    next();
});

export const canDeleteReview = catchAsync(async (req, res, next) => {
    const isAdmin = req.user.roles.some(role => role.name === 'admin');
    if (isAdmin)
        return next();

    const userId = req.user._id;
    const productId = req.params.productId;

    const review = await Review.findOne({ userId, productId });
    if (!review)
        return next(new AppError("You are not allowed to delete another person's review", 403));

    next();
});

// require review id in params

export const getProductReviews = (req, res, next) =>
    getAll(Review, { productId: req.params.productId })(req, res, next);

export const addProductReview = createOne(Review);

export const editProductReview = updateOne(Review);

export const deleteProductReview = deleteOne(Review); 

