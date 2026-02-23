import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  protect,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/me", protect, getCurrentUser);

export default router;
