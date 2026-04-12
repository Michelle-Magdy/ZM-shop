import express from "express";
import { protect } from "../controllers/auth.controller.js";
import {
  adminOrdersStats,
  cancelOrder,
  createOrder,
  getOrders,
  getUserOrders,
  updateOrderStatus,
  userOrderStats,
} from "../controllers/order.controller.js";
import { checkValidMongoId } from "../middlewares/checkValidMongoId.js";
import { validateCart } from "../middlewares/cart.middleware.js";
import { authorize } from "../controllers/auth.controller.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getUserOrders).post(validateCart, createOrder);

router.get("/stats", userOrderStats);

router.post("/cancel/:orderId", checkValidMongoId("orderId"), cancelOrder);

router.use(authorize("admin"));

router.get("/admin/stats", adminOrdersStats);
router.get("/admin", getOrders);
router.patch("/admin/:orderId", checkValidMongoId("orderId"), updateOrderStatus)

export default router;
