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

router.get("/:categoryId/filters", getAvailableFilters);
router.get("/:identifier", getOneCategory);
router.use(protect, authorize("admin", "vendor"));

router
  .route("/:identifier")

  .patch(uploadImage, resizeImage, deleteOldImage, updateCategory)
  .delete(deleteCategory);

export default router;
