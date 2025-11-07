import Coupon from "../models/coupon.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { createOne, deleteOne, getAll, updateOne } from "./factoryHandler.js";

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

    if(!coupon)
        return next(new AppError("Code is invalid or expired", 400));

    res.status(200).json({
        status: "success",
        message: "Code exist and is valid",
        discount: coupon.discountPercentage
    });
})