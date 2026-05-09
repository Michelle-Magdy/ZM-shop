import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryTree,
  getOneCategory,
  updateCategoryHandler,
  uploadImage,
  resizeImage,
  deleteOldImage,
  getAvailableFilters,
  getCategoryStats,
} from "../controllers/category.controller.js";
import { authorize, protect } from "../controllers/auth.controller.js";
import { validateCategoryUpdate } from "../middlewares/categoryValidation.js";

const router = express.Router();

router
  .route("/")
  .get(getCategoryTree)
  .post(uploadImage, resizeImage, createCategory);

router.get("/stats", protect, authorize("admin"), getCategoryStats);
router.get("/:categoryId/filters", getAvailableFilters);
router
  .route("/:id")
  .get(getOneCategory)
  .patch(
    protect, authorize("admin", "vendor"),
    uploadImage,
    resizeImage,
    validateCategoryUpdate,
    deleteOldImage,
    updateCategoryHandler,
  )
  .delete(protect, authorize("admin", "vendor"),deleteCategory);

export default router;
