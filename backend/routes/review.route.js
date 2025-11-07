import express from "express";
import {
  addProductReview,
  deleteProductReview,
  editProductReview,
  getProductReviews,
  productReviewSanitizer,
  canDeleteReview,
  includeReviewParam,
  getProductStats,
  canAddReview,
} from "../controllers/review.controller.js";
import { protect } from "../controllers/auth.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
const router = express.Router();

router.get("/:productId/stats", getProductStats);
router
  .route("/:productId")
  .get(checkValidMongoId("productId"),getProductReviews)
  .post(checkValidMongoId("productId"),protect, productReviewSanitizer, canAddReview, addProductReview)
  .patch(checkValidMongoId("productId"),protect, productReviewSanitizer, includeReviewParam, editProductReview)
  .delete(checkValidMongoId("productId"),protect, canDeleteReview, includeReviewParam, deleteProductReview);

export default router;
