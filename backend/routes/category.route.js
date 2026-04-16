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
router.get("/:id", getOneCategory);
router.use(protect, authorize("admin", "vendor"));
router
  .route("/:id")
  .patch(
    uploadImage,
    resizeImage,
    validateCategoryUpdate,
    deleteOldImage,
    updateCategoryHandler,
  )
  .delete(deleteCategory);

export default router;
