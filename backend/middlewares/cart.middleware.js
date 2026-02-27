import { validateCartItems } from '../services/cart.service.js';
import catchAsync from '../util/catchAsync.js';
import Cart from '../models/cart.model.js';

export const validateCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate('items.productId', 'variants');

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const { error, hasChanges } = await validateCartItems(cart);

    if (error) {
        return res.status(409).json({
            status: "error",
            message: error.message
        });
    }

    req.cart = cart;
    req.priceChanged = hasChanges;
    next();
});