import express from "express";
import productType from "../models/product.type.model.js";
import {
  createProduct,
  getAllProducts,
  productSanitizer,
  deleteProduct,
  updateProduct,
  getProduct,
  uploadImages,
  resizeImages,
} from "../controllers/product.controller.js";
import { protect, authorize } from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    protect,
    authorize("admin", "vendor"),
    uploadImages,
    resizeImages,
    productSanitizer,
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .patch(
    protect,
    authorize("admin", "vendor"),
    uploadImages,
    resizeImages,
    productSanitizer,
    updateProduct
  )
  .delete(protect, authorize("admin", "vendor"), deleteProduct);

export default router;
