import express from "express";

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
  getBestSellerProducts,
  getFeaturedProducts,
  getTopDiscounts,
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
    createProduct,
  );

router.get("/bestsellers", getBestSellerProducts);
router.get("/featured", getFeaturedProducts);
router.get("/topDiscounts", getTopDiscounts)

router.get("/category/:identifier", getProductsByCategory);

router
  .route("/:slug")
  .get(getProduct)
  .patch(
    protect,
    authorize("admin", "vendor"),
    uploadImages,
    resizeImages,
    deleteOldImagesOnUpdate,
    productSanitizer,
    updateProduct,
  )
  .delete(protect, authorize("admin", "vendor"), deleteProduct);

// router
//   .route("/:id")
//   .get(checkValidMongoId("id"), getProduct)
//   .patch(
//     checkValidMongoId("id"),
//     protect,
//     authorize("admin", "vendor"),
//     uploadImages,
//     resizeImages,
//     deleteOldImagesOnUpdate,
//     productSanitizer,
//     updateProduct,
//   )
//   .delete(
//     checkValidMongoId("id"),
//     protect,
//     authorize("admin", "vendor"),
//     deleteProduct,
//   );

export default router;
