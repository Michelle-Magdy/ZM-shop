import express from "express";
import globalErrorHandler from "./controllers/errorController.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import FAQRouter from "./routes/FAQ.route.js";
import productTypeRouter from "./routes/product.type.route.js";
import productRouter from "./routes/product.route.js";
import reviewRouter from "./routes/review.route.js";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import couponRouter from "./routes/coupon.route.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static("./backend/public"));

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

app.use(globalErrorHandler);

export default app;
