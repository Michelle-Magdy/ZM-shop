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
            quantity: {
                type: Number,
                required: true
            },
            addToCartPrice: {
                type: mongoose.Schema.Types.Decimal128,
                required: true
            }
        }
    ]
});

cartSchema.pre(/^find/, function(next){
    this.populate('items.productId', 'title coverImage price');
    next();
})

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;