import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
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
                isActive: { type: Boolean, default: true }
            },

            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    paymentMethod: {
        type: String,
        enum: ["CASH", "ONLINE"],
        default: "CASH",
    },
    orderStatus: {
        type: String,
        enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PENDING",
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
        }
    }
}, {
    timestamps: true
});

orderSchema.index({ userId: 1 });
orderSchema.index({ "address.location": "2dsphere" });

const Order = mongoose.model('Order', orderSchema);
export default Order;