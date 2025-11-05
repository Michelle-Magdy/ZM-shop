import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  key: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["string", "number", "boolean", "select"],
  },
  options: [String],
  isRequired: { type: Boolean, default: false },
});

const productTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  attributes: [attributeSchema],
});

const productType = mongoose.model("ProductType", productTypeSchema);

export default productType;
