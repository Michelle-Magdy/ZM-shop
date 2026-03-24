import mongoose from "mongoose";
import Order from "../models/order.model.js";
import catchAsync from "../util/catchAsync.js";

export const getDashboardStats = catchAsync(async (req, res, next) => {
  const { from, to } = req.query;

  if (!to || !from) res.status(400).json({ status: "bad request" });
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: fromDate, $lte: toDate },
        orderStatus: { $ne: "CANCELLED" },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
        uniqueCustomers: { $addToSet: "$userId" },
        avgOrderValue: { $avg: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        totalRevenue: 1,
        numberOfCustomers: { $size: "$uniqueCustomers" },
        avgOrderValue: { $round: ["$avgOrderValue", 2] },
      },
    },
  ]);

  res.status(200).json({ status: "success", data: stats[0] || {} });
});

export const getChartData = catchAsync(async (req, res, next) => {
  const { from, to, groupBy = "day" } = req.query;

  if (!to || !from || !groupBy)
    return res.status(400).json({ status: "bad request" });
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const groupFormats = {
    year: { year: { $year: "$createdAt" } },
    month: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
    quarter: {
      year: { $year: "$createdAt" },
      quarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
    },
    day: {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" },
    },
  };

  const idConfig = groupFormats[groupBy] || groupFormats["day"];
  const stats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: fromDate, $lte: toDate },
        paymentStatus: { $eq: "PAID" },
      },
    },
    {
      $group: {
        _id: idConfig,
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
        uniqueCustomers: { $addToSet: "$userId" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        label: "$_id",
        revenue: 1,
        orders: 1,
        numberOfCustomers: { $size: "$uniqueCustomers" },
      },
    },
  ]);
  res.status(200).json({ status: "success", data: stats });
});

export const getRecentOrders = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const orders = await Order.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        as: "customerDetails",
        localField: "userId",
        foreignField: "_id",
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: "$customerDetails",
      },
    },
    {
      $project: {
        _id: 1,
        orderNumber: 1,
        customerName: "$customerDetails.name",
        product: { $arrayElemAt: ["$items.title", 0] },
        totalPrice: "$totalPrice",
        orderStatus: "$orderStatus",
        paymentStatus: "$paymentStatus",
        date: "$createdAt",
      },
    },
  ]);

  res
    .status(200)
    .json({ status: "success", results: orders.length, data: orders });
});
