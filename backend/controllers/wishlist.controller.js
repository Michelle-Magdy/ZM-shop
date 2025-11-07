import { response } from "express";
import Wishlist from "../models/wishlist.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import { getOne } from "./factoryHandler.js";

// get one wishlist using user id
export const getWishlist = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  return getOne(Wishlist, { userId })(req, res, next);
});
// clear wishlist
export const clearWishlist = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const wishlist = await Wishlist.findOneAndUpdate({ userId }, { items: [] });
  res.status(204).json({
    data: wishlist,
  });
});
// add item to wishlist
export const addItemToWishlist = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist)
    return next(new AppError("there is no wishlist for this user", 404));
  if (!wishlist.items.find((product) => product === productId.toString())) {
    wishlist.items.push(productId);
  }
  await wishlist.save();
  res.status(200).json({
    message: "item added successfully",
    data: wishlist,
  });
});

// remove item from wishlist
export const removeItemFromWishlist = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist)
    return next(new AppError("there is no wishlist for this user", 404));
  wishlist.items = wishlist.items.filter(
    (item) => item._id.toString() !== productId
  );
  await wishlist.save();
  res.status(200).json({
    data: wishlist,
  });
});
