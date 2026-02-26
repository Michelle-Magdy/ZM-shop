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
    fullAddress: {
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
addressSchema.pre("save", async function (next) {
  // If this one is being set as default
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false },
    );
  }
  next();
});
const Address = mongoose.model("Address", addressSchema);

export default Address;
