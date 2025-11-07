import express from "express";
import productType from "../models/product.type.model.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
import {
  createProduct,
  getAllProducts,
  productSanitizer,
  deleteProduct,
  updateProduct,
  getProduct,
  uploadImages,
  resizeImages,
  deleteOldImagesOnUpdate,
  getProductsByCategory,
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

router.get("/category/:categoryId", getProductsByCategory);

router
  .route("/:id")
  .get(checkValidMongoId("id"), getProduct)
  .patch(
    protect,
    authorize("admin", "vendor"),
    checkValidMongoId("id"),
    uploadImages,
    resizeImages,
    deleteOldImagesOnUpdate,
    productSanitizer,
    updateProduct
  )
  .delete(
    protect,
    authorize("admin", "vendor"),
    checkValidMongoId("id"),
    deleteProduct
  );

export default router;
