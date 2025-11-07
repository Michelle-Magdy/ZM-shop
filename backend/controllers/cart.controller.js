import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";

export const getUserCart = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    
    if (!cart) //probably won't happen as every user has a cart
        return next(new AppError("No cart for current user", 404));

    res.status(200).json({
        status: "success",
        length: cart.items.length,
        items: cart.items
    });
})

export const addCartItem = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!productId) {
        return next(new AppError("product id is required", 400));
    }

    const cart = await Cart.findOne({ userId });
    if (!cart)
        return next(new AppError("No cart for current user", 404));

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    const itemExist = cart.items.find(it => it.productId.toString() == productId);
    if (!itemExist) {
        cart.items.push({
            productId,
            addToCartPrice: product.price,
            quantity: 1
        });
        await cart.save();
    }

    res.status(200).json({
        status: "success",
        item: {
            productId,
            addToCartPrice: product.price,
            quantity: 1
        }
    });
})

export const modifyItemQuantity = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return next(new AppError("Missing product id or quantity", 400));
    }

    if(quantity === 0)
        return next(); // remove item from cart middleware

    const cart = await Cart.findOne({ userId });
    if (!cart) 
        return next(new AppError("No cart for current user", 404));

    const item = cart.items.find(it => it.productId.toString() === productId);
    if (!item) {
        return next(new AppError("Item not found in cart", 404));
    }

    item.quantity = quantity;
    await cart.save();

    res.status(201).json({
        status: "success",
        item
    });
})

export const removeItemFromCart = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
    const { productId } = req.body;
    if (!productId) {
        return next(new AppError("Missing product id", 400));
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) 
        return next(new AppError("No cart for current user", 404));

    cart.items = cart.items.filter(it => it.productId.toString() !== productId);
    await cart.save();

    res.status(204).json({
        status: "success",
        data: null
    });
})