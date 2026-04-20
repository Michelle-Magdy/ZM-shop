import AppError from "../util/appError.js";
import User from "../models/user.model.js";
import catchAsync from "../util/catchAsync.js";
import Role from "../models/role.model.js";
import APIFeatures from "../util/apiFeatures.js";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";

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

export const addUser = catchAsync(async (req, res, next) => {
  const { name, email, role, password } = req.body;
  const roleId = role === "customer" ? process.env.USER_ROLE_ID :
    role === "admin" ? process.env.ADMIN_ROLE_ID :
      role === "vendor" ? process.env.VENDOR_ROLE_ID : null;

  if (!roleId)
    return next(new AppError("No role was specified", 401));

  const user = await User.create({
    name,
    email,
    password,
    roles: [roleId],
    isVerified: true
  });

  if (role === "customer") {
    //Create a cart for new user
    await Cart.create({ userId: user._id, items: [] });
    // create a wishlist for the new user
    await Wishlist.create({ userId: user._id, items: [] });
  }

  res.status(201).json({
    status: "success",
    message: "User was created successfully."
  })
})

export const updateUser = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  const update = req.body;


  console.log(id);
  const updatedDocument = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
    bypassDeletedFilter: true
  });
  console.log(updatedDocument);


  res.status(200).json({
    status: "Success",
    data: {
      document: updatedDocument,
    },
  });
}); // id in params and data in request body

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