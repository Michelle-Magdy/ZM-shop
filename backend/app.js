import express from "express";
import globalErrorHandler from "./controllers/errorController.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import FAQRouter from "./routes/faq.route.js";
import productTypeRouter from "./routes/product.type.route.js";
import productRouter from "./routes/product.route.js";
import reviewRouter from "./routes/review.route.js";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import couponRouter from "./routes/coupon.route.js";
import addressRouter from "./routes/addresss.route.js";
import paymentRouter from "./routes/payment.route.js";
import stripeRouter from "./routes/stripe.route.js";
import orderRouter from "./routes/order.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import reportsRouter from "./routes/reports.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? process.env.DEVELOPMENT_URL
        : process.env.PRODUCTION_URL, // Your Next.js URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(passport.initialize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/FAQ", FAQRouter);
app.use("/api/v1/product-type", productTypeRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/stripe", stripeRouter);
app.use("/api/v1/admin/dashboard", dashboardRouter);
app.use("/api/v1/admin/reviews/reports", reportsRouter);
app.use(globalErrorHandler);

export default app;
