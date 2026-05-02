import mongoose from "mongoose";
import app from "./app.js";

let isConnected = false;

console.log("MONGO_URI exists?", !!process.env.MONGO_URI);
console.log("MONGO_URI length:", process.env.MONGO_URI?.length);

async function connectDb() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = conn.connections[0].readyState === 1;
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

app.use(async (req, res, next) => {
  await connectDb();
  next();
});

export default app;
