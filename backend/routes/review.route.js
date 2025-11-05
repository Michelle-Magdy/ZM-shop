import express from 'express';
import { addProductReview, deleteProductReview, editProductReview, getProductReviews, productReviewSanitizer, canDeleteReview, includeReviewParam } from '../controllers/review.controller.js';
import { protect } from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/:productId')
.get(getProductReviews)
.post(protect, productReviewSanitizer, addProductReview)
.patch(protect, productReviewSanitizer, includeReviewParam, editProductReview)
.delete(protect,canDeleteReview, includeReviewParam, deleteProductReview);

export default router;