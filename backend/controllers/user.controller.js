import AppError from "../util/appError.js";
import User from "../models/user.model.js";
import catchAsync from "../util/catchAsync.js";
import Role from "../models/role.model.js";
import APIFeatures from "../util/apiFeatures.js";

import {
  createOne,
  getAll,
  getOne,
  softDeleteOne,
  updateOne,
} from "./factoryHandler.js";
import { getMonthlyUsersStats } from "../services/stats.service.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { role, ...otherQuery } = req.query;
  let baseFilter = { bypassDeletedFilter: true };

  if (role) {
    const roleDoc = await Role.findOne({ name: role }).select('_id');
    if (!roleDoc) {
      return res.status(200).json({
        status: "Success",
        results: 0,
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        data: []
      });
    }
    baseFilter.roles = roleDoc._id;
  }

  // Create fresh APIFeatures instance with modified query
  const features = new APIFeatures(User, otherQuery)
    .filter()
    .search(["email", "name"])
    .paginate()
    .populate([["roles", "name"]])
    .extraSelect("+isDeleted +isSuspended");

  const result = await features.execute(User, baseFilter);

  res.status(200).json({
    status: "Success",
    results: result.documents.length,
    totalCount: result.totalCount,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    data: result.documents,
  });
});


export const getUser = getOne(User); // id must be in params as 'id'

export const addUser = createOne(User); // data should be in request body

export const updateUser = updateOne(User); // id in params and data in request body

export const deleteUser = softDeleteOne(User); // id in params and it's not soft delete

export const getUserPermissions = catchAsync(async (req, res, next) => {
  const permissions = req.user.roles.flatMap((role) => role.permissions);

  res.status(200).json({
    status: "success",
    permissions,
  });
});

export const updateMe = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const { name, phone, gender } = req.body;
  const user = await User.findByIdAndUpdate(
    { _id },
    { name, phone, gender },
    { runValidators: true, new: true },
  );
  if (!user) return next(new AppError("user cannot be updated", 500));
  res.status(200).json({ message: "user updated successfully", data: user });
});

export const getUsersStats = catchAsync(async (req, res, next) => {
  //we need count of total users, total active, new this month, new last month and admins
  const result = await getMonthlyUsersStats();

  res.status(200).json({
    status: "success",
    ...result
  });
})