import express from "express";
import dotenv from "dotenv";
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import FAQRouter from './routes/FAQ.route.js';
dotenv.config();

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/FAQ', FAQRouter);

export default app;


