import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    label: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true, // [lng, lat]
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
// to enable location-based queries
addressSchema.index({ location: "2dsphere" });

const Address = mongoose.model("Address", addressSchema);

export default Address;
