import Order from "../models/order.model.js";
import { cancelOrderService, createOrderService } from "../services/order.service.js";
import catchAsync from "../util/catchAsync.js";

export const getUserOrders = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const orders = await Order.find({ userId });

    res.status(200).json({
        status: "success",
        orders
    });
})

export const createOrder = catchAsync(async (req, res, next) => { // Used when paying in cash
    const userId = req.user._id;
    const { address, phone } = req.body;

    if (req.priceChanged) {
        return res.status(200).json({
            status: "price_changed",
            message: "Some item prices have been updated.\nPlease review your cart.",
            items: req.cart.items
        });
    }

    const order = await createOrderService(userId, { address, phone }, false, req.cart);

    res.status(201).json({
        status: "success",
        order
    });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
    const { orderId } = req.body;
    const userId = req.user._id;
    await cancelOrderService(userId, orderId);
    res.status(200).json({ status: "success", message: "Order cancelled successfully." });
})