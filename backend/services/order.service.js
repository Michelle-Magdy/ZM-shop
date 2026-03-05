import mongoose from "mongoose";
import Order from "../models/order.model.js";
import AppError from "../util/appError.js";
import Product from "../models/product.model.js";
import stripe from "../stripeConfig.js";

export const createOrderService = async (
    userId,
    data,
    paid,
    cart,
    stripeSessionId,
    stripePaymentIntentId = null
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalPrice = cart.items.reduce((acc, item) => {
            return acc + item.variant.price * item.quantity;
        }, 0);

        if (cart.coupon?.couponId) {
            const coupon = cart.coupon.couponId;

            const isValid = coupon.isActive && coupon.expirationDate > new Date();

            if (!isValid) {
                throw new AppError("Coupon is no longer valid", 400);
            }

            const discountAmount = totalPrice * (cart.coupon.discountPercentage / 100);
            totalPrice = totalPrice - discountAmount;
        }

        const orderData = {
            userId,
            items: cart.items.map(item => item.toObject()),
            address: {
                label: data.address.label,
                fullAddress: data.address.fullAddress,
                location: {
                    type: "Point",
                    coordinates: [
                        data.address.location.coordinates[0],
                        data.address.location.coordinates[1]
                    ]
                }
            },
            phone: data?.phone,
            paymentMethod: paid ? "ONLINE" : "CASH",
            paymentStatus: paid ? "PAID" : "UNPAID",
            totalPrice
        };

        if (stripeSessionId) {
            orderData.stripeSessionId = stripeSessionId;
        }

        if (stripePaymentIntentId) {
            orderData.stripePaymentIntentId = stripePaymentIntentId;
        }

        const [order] = await Order.create([orderData], { session });


        for (const item of cart.items) {
            const result = await Product.updateOne(
                {
                    _id: item.productId,
                    "variants.sku": item.variant.sku,
                    "variants.stock": { $gte: item.quantity }
                },
                { $inc: { "variants.$.stock": -item.quantity } },
                { session }
            );

            if (result.modifiedCount === 0) {
                throw new AppError("Insufficient stock", 400);
            }
        }

        cart.items = [];
        cart.coupon = undefined;
        await cart.save({ session });

        await session.commitTransaction();
        return order;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const cancelOrderService = async (userId, orderId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne(
            { _id: orderId, userId, orderStatus: "PENDING" }
        ).session(session);

        if (!order)
            throw new AppError("Order not found or cannot be cancelled.", 400);

        for (const item of order.items) {
            await Product.updateOne(
                { _id: item.productId, "variants.sku": item.variant.sku },
                { $inc: { "variants.$.stock": item.quantity } },
                { session }
            );
        }
        order.orderStatus = "CANCELLED";

        if (order.paymentMethod === "ONLINE" && order.paymentStatus === "PAID" && order.refundStatus === "NONE") {
            order.refundStatus = "PENDING";
            await order.save({ session });

            try {
                await stripe.refunds.create({
                    payment_intent: order.stripePaymentIntentId,
                    reason: 'requested_by_customer'
                }, { idempotencyKey: `refund_${order._id}` });

                order.refundStatus = "SUCCESS";

            } catch (stripeErr) {
                // Mark as failed but CONTINUE (don't throw)
                order.refundStatus = "FAILED";
                order.refundError = stripeErr.message;
                // should send alert to admin for manual review
                console.error(`Stripe refund failed for order ${orderId}:`, stripeErr.message);
            }
        }

        await order.save({ session });
        await session.commitTransaction();
        return order;

    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
}