import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
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
    ]
});

cartSchema.index({ "items.variant.sku": 1 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;