import express from 'express';
import { addProductReview, deleteProductReview, editProductReview, getProductReviews, productReviewSanitizer, canDeleteReview, includeReviewParam, getProductStats, canAddReview } from '../controllers/review.controller.js';
import { protect } from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/:productId')
.get(getProductReviews)
.post(protect, productReviewSanitizer, canAddReview, addProductReview)
.patch(protect, productReviewSanitizer, includeReviewParam, editProductReview)
.delete(protect,canDeleteReview, includeReviewParam, deleteProductReview);

router.get('/:productId/stats', getProductStats);

export default router;