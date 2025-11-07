import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true },
  items,
});
