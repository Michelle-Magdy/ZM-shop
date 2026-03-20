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
import {
  googleAuth,
  googleCallback,
  googleTokenAuth,
} from "../controllers/googleAuth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/me", protect, getCurrentUser);

// server sid redirect flow
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// client sid roken flow
router.post("/google/token", googleTokenAuth);

export default router;
