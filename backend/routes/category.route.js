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
  .post(
    protect,
    authorize("admin", "vendor"),
    uploadImage,
    resizeImage,
    createCategory
  );

router
  .route("/:id")
  .get(
    protect,
    authorize("admin", "vendor"),
    checkValidMongoId("id"),
    getOneCategory
  )
  .patch(
    protect,
    authorize("admin", "vendor"),
    checkValidMongoId("id"),
    uploadImage,
    resizeImage,
    deleteOldImage,
    updateCategory
  )
  .delete(
    protect,
    authorize("admin", "vendor"),
    checkValidMongoId("id"),
    deleteCategory
  );

export default router;
