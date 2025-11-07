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
  .route("/:id")
  .get(checkValidMongoId("id"), getOneCategory)
  .patch(
    checkValidMongoId("id"),
    uploadImage,
    resizeImage,
    deleteOldImage,
    updateCategory
  )
  .delete(checkValidMongoId("id"), deleteCategory);

export default router;
