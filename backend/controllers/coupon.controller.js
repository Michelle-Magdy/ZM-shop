import Coupon from "../models/coupon.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";
import Cart from "../models/cart.model.js";

export const couponSanitizer = (req, res, next) => {
    const { code, discountPercentage, expirationDate, isActive } = req.body;

    req.body = {
        code,
        discountPercentage,
        expirationDate,
        isActive
    };

    next();
}

export const addCoupon = createOne(Coupon);

export const removeCoupon = deleteOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const getCoupons = getAll(Coupon);

export const couponExist = catchAsync(async (req, res, next) => {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon)
        return next(new AppError("Code is invalid or expired", 400));

    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart)
        return next(new AppError("No cart for current user", 404));

    cart.coupon = {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        appliedAt: new Date(),
        couponId: coupon._id
    };
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Code exist and is valid",
        coupon: cart.coupon
    });
})

export const removeCouponFromCart = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart)
        return next(new AppError("No cart for current user", 404));
    cart.coupon = null
    await cart.save();
    res.status(201).json({
        status: "success",
        message: "Coupon removed successfully."
    });
});