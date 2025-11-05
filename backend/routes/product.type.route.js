import express from "express";
import { authorize, protect } from "../controllers/auth.controller.js";
import {
  createProductType,
  deleteProductType,
  getAllProductTypes,
  getProductType,
  productTypeSanitizer,
  updateProductType,
} from "../controllers/product.type.controller.js";

const router = express.Router();
router.use(protect, authorize("admin", "vendor"));

router
  .route("/")
  .get(getAllProductTypes)
  .post(productTypeSanitizer, createProductType);

router
  .route("/:id")
  .get(getProductType)
  .patch(productTypeSanitizer, updateProductType)
  .delete(deleteProductType);

export default router;
