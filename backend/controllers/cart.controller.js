import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";

export const cartSanitizar = (req, res, next) => {
    if (!Array.isArray(req.body.items)) {
        return next(new AppError("Items must be an array", 400));
    }

    req.body.items = req.body.items.map(item => {
        const { productId, slug, title, coverImage, variant, quantity } = item;

        return {
            productId,
            slug,
            title,
            coverImage,
            variant: variant
                ? {
                    sku: variant.sku,
                    attributeValues: variant.attributeValues,
                    price: variant.price,
                    stock: variant.stock,
                    isActive: variant.isActive,
                }
                : undefined,
            quantity: quantity || 1,
        };
    });

    next();
};
export const getUserCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) //probably won't happen as every user has a cart
        return next(new AppError("No cart for current user", 404));

    res.status(200).json({
        status: "success",
        items: cart.items
    });
})

export const updateCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    if (!cart)
        return next(new AppError("No cart for current user", 404)); //won't happen every user has a cart

    cart.items = req.body.items;
    await cart.save();

    res.status(200).json({
        status: "success",
        items: cart.items
    });
})

