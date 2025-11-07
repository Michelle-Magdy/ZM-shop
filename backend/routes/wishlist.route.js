import express from "express";
import {
  addItemToWishlist,
  clearWishlist,
  getWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authorize, protect } from "../controllers/auth.controller.js";
import Wishlist from "../models/wishlist.model.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();
router.use(protect, authorize("admin", "vendor", "delivery", "user"));

router.route("/:userId").get(checkValidMongoId("userId"), getWishlist);
router.delete("/:userId/clear", checkValidMongoId("userId"), clearWishlist);
router.delete(
  "/:userId/removeItem",
  checkValidMongoId("userId"),
  removeItemFromWishlist
);
router.post("/:userId/addItem", checkValidMongoId("userId"), addItemToWishlist);

export default router;
