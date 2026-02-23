import AppError from "../util/appError.js";
import User from "../models/user.model.js";
import catchAsync from "../util/catchAsync.js";
import {
  createOne,
  getAll,
  getOne,
  softDeleteOne,
  updateOne,
} from "./factoryHandler.js";

export const getAllUsers = getAll(User);

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
