import express from "express";
import {
  getWishlist,
  updateWishlist,
  wishlistSanitizar
} from "../controllers/wishlist.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getWishlist).put( wishlistSanitizar, updateWishlist)


export default router;
