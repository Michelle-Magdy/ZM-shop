import validateDateRange from "../middlewares/validateDateRange.middleware.js";
import { authorize, protect } from "../controllers/auth.controller.js";
import {
  getChartData,
  getDashboardStats,
  getRecentOrders,
} from "../controllers/dashboard.controller.js";
import express from "express";

const router = express.Router();
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", validateDateRange, getDashboardStats);
router.get("/chart", validateDateRange, getChartData);
router.get("/recent-orders", getRecentOrders);

export default router;
