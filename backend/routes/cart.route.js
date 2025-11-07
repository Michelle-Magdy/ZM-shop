import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  addCartItem,
  getUserCart,
  modifyItemQuantity,
  removeItemFromCart,
} from "../controllers/cart.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";

const router = express.Router();

router.use(protect);
router
  .route("/:userId")
  .get(checkValidMongoId("userId"), getUserCart)
  .post(checkValidMongoId("userId"), addCartItem)
  .patch(checkValidMongoId("userId"), modifyItemQuantity, removeItemFromCart)
  .delete(checkValidMongoId("userId"), removeItemFromCart);

export default router;
