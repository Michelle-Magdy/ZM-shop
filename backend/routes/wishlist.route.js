import express from "express";
import {
  addItemToWishlist,
  clearWishlist,
  getWishlist,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authorize, protect } from "../controllers/auth.controller.js";
import Wishlist from "../models/wishlist.model.js";

const router = express.Router();
router.use(protect, authorize("admin", "vendor", "delivery", "user"));

router.route("/:userId").get(getWishlist);
router.delete("/:userId/clear", clearWishlist);
router.delete("/:userId/removeItem", removeItemFromWishlist);
router.post("/:userId/addItem", addItemToWishlist);

export default router;
