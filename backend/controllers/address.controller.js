import catchAsync from "../util/catchAsync.js";
import Address from "../models/address.model.js";
import AppError from "../util/appError.js";
export const addAddress = catchAsync(async (req, res, next) => {
  const {
    userId,
    latitude,
    longitude,
    label,
    address: add,
    isDefault,
  } = req.body;
  const address = await Address.create({
    userId,
    location: {
      coordinates: [longitude, latitude],
    },
    label,
    address: add,
    isDefault,
  });
  if (!address) return next(new AppError("cannot create new address", 500));
  res
    .status(201)
    .json({ message: "new address created successfully", data: address });
});

export const getAddresses = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const addresses = await Address.find({ userId });
  if (!addresses) return next(new AppError("cannot fetch addresses", 404));
  res
    .status(200)
    .json({ message: "addresses found successfully", data: addresses });
});
