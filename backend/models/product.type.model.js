import mongoose from "mongoose";
import slugify from "slugify";

// ========== ProductType Schema ==========
const attributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // normalize keys
    },
    type: {
      type: String,
      required: true,
      enum: ["string", "number", "boolean", "select", "color", "date"], // added color
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    isRequired: { type: Boolean, default: false },
    isFilterable: { type: Boolean, default: false }, // for faceted search
    isVariant: { type: Boolean, default: false }, // marks this as a variant dimension (size, color)
  },
  { _id: true },
); // ensure each attribute has _id for referencing

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    attributes: [attributeSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default productTypeSchema;
