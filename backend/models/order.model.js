import mongoose from "mongoose";
import OrderCounter from "./orderCounter.model.js";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },

        slug: String,

        title: { type: String, required: true },

        coverImage: { type: String, required: true },

        variant: {
          sku: String,
          attributeValues: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: new Map(),
          },
          price: { type: Number, required: true, min: 0 },
          stock: {
            type: Number,
            default: 0,
            min: 0,
          },
          isActive: { type: Boolean, default: true },
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["CASH", "ONLINE"],
      default: "CASH",
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    stripeSessionId: {
      type: String,
      unique: true, // ensures idempotency for online payments
      sparse: true, // allows multiple orders with null/undefined (for CASH)
    },
    address: {
      label: {
        type: String,
        trim: true,
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
    },
    phone: {
      type: String,
      required: [true, "Order must have a phone number."],
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", async function (next) {
  if (this.isModified("items") || this.isNew) {
    this.totalPrice = this.items.reduce((acc, item) => {
      return acc + item.variant.price * item.quantity;
    }, 0);
  }
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}${month}`;

    const counter = await OrderCounter.findOneAndUpdate(
      {
        _id: "OrderNumber",
        yearMonth,
      },
      {
        $inc: { sequence: 1 }, // increment sequence by 1
      },
      {
        upsert: true, // create if new update if exists
        new: true, // return updated document
      },
    );
    const sequence = String(counter.sequence).padStart(4, "0");
    this.orderNumber = `ORD-${yearMonth}-${sequence}`;
  }
  next();
});

orderSchema.index({ userId: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "address.location": "2dsphere" });

const Order = mongoose.model("Order", orderSchema);
export default Order;
