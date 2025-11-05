import express from "express";
import dotenv from "dotenv";
import globalErrorHandler from "./controllers/errorController.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import FAQRouter from "./routes/FAQ.route.js";
import productTypeRouter from "./routes/product.type.route.js";
import productRouter from "./routes/product.route.js";
dotenv.config();

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static("./backend/public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/FAQ", FAQRouter);
app.use("/api/v1/product-type", productTypeRouter);
app.use("/api/v1/product", productRouter);

app.use(globalErrorHandler);

export default app;
