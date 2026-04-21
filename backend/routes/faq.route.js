import express from "express";
import {
  addFAQ,
  deleteFAQ,
  getAllFAQ,
  updateFAQ,
} from "../controllers/faq.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();

router.route("/").get(getAllFAQ).post(addFAQ);

router
  .route("/:id")
  .delete(checkValidMongoId("id"), deleteFAQ)
  .patch(checkValidMongoId("id"), updateFAQ);

export default router;
