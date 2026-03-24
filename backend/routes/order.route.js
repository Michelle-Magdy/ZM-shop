import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  cancelOrder,
  createOrder,
  getUserOrders,
  userOrderStats,
} from "../controllers/order.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
import { validateCart } from "../middlewares/cart.middleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getUserOrders).post(validateCart, createOrder);

router.get("/stats", userOrderStats);

router.post("/cancel/:orderId", checkValidMongoId("orderId"), cancelOrder);

export default router;
