import mongoose from "mongoose";
import Order from "../models/order.model.js";
import {
  cancelOrderService,
  createOrderService,
} from "../services/order.service.js";
import catchAsync from "../util/catchAsync.js";
import AppError from "../util/appError.js";
import APIFeatures from "../util/apiFeatures.js";

export const getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  req.query.sort = "-createdAt";

  const features = new APIFeatures(Order, req.query)
    .filter()
    .sort()
    .paginate();

  const orders = await features.execute(Order, { userId });

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
    null,
  );

  res.status(201).json({
    status: "success",
    order,
  });
});

export const cancelOrder = catchAsync(async (req, res, next) => {
  //Good in case of cash on delivery, in online payment, we will handle cancellation via stripe webhooks
  const { orderId } = req.params;
  const userId = req.user._id;
  await cancelOrderService(userId, orderId);
  res
    .status(200)
    .json({ status: "success", message: "Order cancelled successfully." });
});

export const userOrderStats = catchAsync(async (req, res, next) => {
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


export const adminOrdersStats = catchAsync(async (req, res, next) => {
  const now = new Date();

  const stats = await Order.aggregate([
    {
      $facet: {
        // Status breakdown (all time)
        byStatus: [
          {
            $group: {
              _id: "$orderStatus",
              count: { $sum: 1 }
            }
          }
        ],

        // Total orders (all time)
        totalOrders: [
          { $count: "total" }
        ]
      }
    },

    {
      $project: {
        totalOrders: { $arrayElemAt: ["$totalOrders.total", 0] },
        pending: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$byStatus",
                cond: { $eq: ["$$this._id", "PENDING"] }
              }
            },
            0
          ]
        },
        shipped: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$byStatus",
                cond: { $eq: ["$$this._id", "SHIPPED"] }
              }
            },
            0
          ]
        },
        delivered: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$byStatus",
                cond: { $eq: ["$$this._id", "DELIVERED"] }
              }
            },
            0
          ]
        },
        cancelled: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$byStatus",
                cond: { $eq: ["$$this._id", "CANCELLED"] }
              }
            },
            0
          ]
        }
      }
    },

    {
      $project: {
        totalOrders: { $ifNull: ["$totalOrders", 0] },
        pending: { $ifNull: ["$pending.count", 0] },
        shipped: { $ifNull: ["$shipped.count", 0] },
        delivered: { $ifNull: ["$delivered.count", 0] },
        cancelled: { $ifNull: ["$cancelled.count", 0] }
      }
    }
  ]);

  const result = stats[0] || {
    totalOrders: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  res.status(200).json({
    status: "success",
    data: result
  });
});

export const getOrders = catchAsync(async (req, res, next) => {
  // Create fresh APIFeatures instance with modified query
  const features = new APIFeatures(Order, req.query)
    .filter()
    .search(["orderNumber", "phone"])
    .paginate()
    .populate([["userId", "name"]]);

  const result = await features.execute(Order);

  res.status(200).json({
    status: "Success",
    results: result.documents.length,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.documents,
  });
});


export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;
  const { orderId } = req.params;

  if (orderStatus === "CANCELLED") {
    await cancelOrderService(null, orderId, true);

    return res.status(200).json({
      status: "success",
      message: "Order cancelled successfully.",
    });
  }

  const allowedStatuses = ["PENDING", "SHIPPED", "DELIVERED"];
  if (!allowedStatuses.includes(orderStatus)) {
    return next(new AppError("Invalid order status.", 400));
  }

  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));

  const allowedTransitions = {
    PENDING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.orderStatus].includes(orderStatus)) {
    return next(new AppError("Invalid status transition", 400));
  }

  order.orderStatus = orderStatus;
  if (orderStatus === "DELIVERED" && order.paymentMethod === "CASH")
    order.paymentStatus = "PAID";

  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully.",
  });
});