import mongoose, { mongo } from "mongoose";
import validator from "validator";

const attributeValueSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed,
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
  olderPrice: mongoose.Schema.Types.Decimal128,
  stock: { type: Number, default: 1, min: 0 },
  description: String,
  productTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  attributes: [{ type: attributeValueSchema, required: true }],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  slug: { type: String, unique: true },
  isDeleted: { type: Boolean, default: false },
});

const product = mongoose.model("Product", productSchema);
export default product;
