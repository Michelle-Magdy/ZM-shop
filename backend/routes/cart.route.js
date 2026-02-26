import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  cartSanitizar,
  getUserCart,
  updateCart
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);
router
  .route("/")
  .get(getUserCart)
  .put(cartSanitizar, updateCart);

export default router;
