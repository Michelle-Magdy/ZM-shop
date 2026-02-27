import mongoose from "mongoose";
import Order from "../models/order.model.js";
import {
  cancelOrderService,
  createOrderService,
} from "../services/order.service.js";
import catchAsync from "../util/catchAsync.js";
import AppError from "../util/appError.js";

export const getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await Order.find({ userId });

  res.status(200).json({
    status: "success",
    orders,
  });
});

export const createOrder = catchAsync(async (req, res, next) => {
  // Used when paying in cash
  const userId = req.user._id;
  const { address, phone } = req.body;

  if (req.priceChanged) {
    return res.status(200).json({
      status: "price_changed",
      message: "Some item prices have been updated.\nPlease review your cart.",
      items: req.cart.items,
    });
  }

  const order = await createOrderService(
    userId,
    { address, phone },
    false,
    req.cart,
  );

  res.status(201).json({
    status: "success",
    order,
  });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.body;
  const userId = req.user._id;
  await cancelOrderService(userId, orderId);
  res
    .status(200)
    .json({ status: "success", message: "Order cancelled successfully." });
});

export const orderStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id || req.user.id;
  const stats = await Order.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              totalSpent: {
                $sum: {
                  $sum: {
                    $map: {
                      input: "$items",
                      as: "item",
                      in: {
                        $multiply: ["$$item.variant.price", "$$item.quantity"],
                      },
                    },
                  },
                },
              },
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: "$orderStatus",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        totalCount: { $arrayElemAt: ["$totals.total", 0] },
        totalSpent: { $arrayElemAt: ["$totals.totalSpent", 0] },
        statusBreakdown: {
          $arrayToObject: {
            $map: {
              input: "$statusCounts",
              as: "status",
              in: {
                k: { $toLower: "$$status._id" },
                v: "$$status.count",
              },
            },
          },
        },
      },
    },
  ]);

  if (!stats) return next(new AppError("failed to fetch stats", 400));

  const raw = stats[0] || { totalCount: 0, totalSpent: 0, statusBreakdown: {} };

  // Merge with defaults for missing statuses
  const result = {
    totalCount: raw.totalCount || 0,
    totalSpent: raw.totalSpent || 0,
    pending: raw.statusBreakdown.pending || 0,
    shipped: raw.statusBreakdown.shipped || 0,
    delivered: raw.statusBreakdown.delivered || 0,
    cancelled: raw.statusBreakdown.cancelled || 0,
  };

  res.status(200).json({ status: "success", data: result });
});
