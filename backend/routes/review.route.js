import express from "express";
import {
  addProductReview,
  deleteProductReview,
  editProductReview,
  getProductReviews,
  productReviewSanitizer,
  canDeleteReview,
  includeReviewParam,
  canAddReview,
  handleHelpfulReview,
  canEditReview,
} from "../controllers/review.controller.js";
import { protect } from "../controllers/auth.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
const router = express.Router();

router.route("/:reviewId")
  .delete(checkValidMongoId("reviewId"), protect, canDeleteReview, includeReviewParam, deleteProductReview)
  .patch(checkValidMongoId("reviewId"), protect, canEditReview, productReviewSanitizer, includeReviewParam, editProductReview);

router.patch("/:reviewId/helpful", checkValidMongoId("reviewId"), protect, handleHelpfulReview);

router
  .route("/product/:productId")
  .get(checkValidMongoId("productId"), getProductReviews)
  .post(checkValidMongoId("productId"), protect, productReviewSanitizer, canAddReview, addProductReview)

export default router;
