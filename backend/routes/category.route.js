import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryTree,
  getOneCategory,
  updateCategory,
  uploadImage,
  resizeImage,
  deleteOldImage,
  getAvailableFilters,
} from "../controllers/category.controller.js";
import { authorize, protect } from "../controllers/auth.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();

router
  .route("/")
  .get(getCategoryTree)
  .post(uploadImage, resizeImage, createCategory);

router.use(protect, authorize("admin", "vendor"));

router
  .route("/:identifier")
  .get(getOneCategory)
  .patch(uploadImage, resizeImage, deleteOldImage, updateCategory)
  .delete(deleteCategory);

router.get("/:categoryId/filters", getAvailableFilters);

export default router;
