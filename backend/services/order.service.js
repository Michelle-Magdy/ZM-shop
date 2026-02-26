import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import AppError from "../util/appError.js";
import Product from "../models/product.model.js";


export const createOrderService = async (userId, address, paid) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const cart = await Cart.findOne({ userId }).session(session);

        if (!cart || cart.items.length === 0) {
            throw new AppError("Your cart is empty", 400);
        }

        const [order] = await Order.create([{
            userId,
            items: cart.items.map(item => item.toObject()),
            address,
            paymentMethod: paid ? "ONLINE" : "CASH"
        }], { session });

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
        await cart.save({ session });

        await session.commitTransaction();
        return order;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }finally {
        session.endSession();
    }
};

export const cancelOrderService = async (userId, orderId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOneAndUpdate(
            { _id: orderId, userId, orderStatus: "PENDING" },
            { orderStatus: "CANCELLED" },
            { new: true, session }
        );

        if (!order)
            throw new AppError("Order not found or cannot be cancelled.", 400);

        for (const item of order.items) {
            await Product.updateOne(
                { _id: item.productId, "variants.sku": item.variant.sku },
                { $inc: { "variants.$.stock": item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();
        
        return order;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    }finally {
        session.endSession();
    }
}