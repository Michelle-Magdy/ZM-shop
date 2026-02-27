import { createCheckoutSession } from "../controllers/payment.controller.js"
import { protect } from "../controllers/auth.controller.js"
import express from "express"
import { validateCart } from "../middlewares/cart.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/checkout-session").post(validateCart, createCheckoutSession);

export default router;