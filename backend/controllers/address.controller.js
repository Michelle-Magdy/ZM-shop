import catchAsync from "../util/catchAsync.js";
import Address from "../models/address.model.js";
import AppError from "../util/appError.js";
import { getOne } from "./factoryHandler.js";
import mongoose from "mongoose";

export const addAddress = catchAsync(async (req, res, next) => {
  let { userId, latitude, longitude, label, address, isDefault } = req.body;

  // Count existing addresses for the user
  const count = await Address.countDocuments({ userId });

  // Rule 1: first address must be default
  if (count === 0) {
    isDefault = true;
  }

  // Create address FIRST
  const newAddress = await Address.create({
    userId,
    label,
    address,
    location: {
      type: "Point",
      coordinates: [longitude, latitude], // <-- FIXED ORDER
    },
    isDefault,
  });

  if (isDefault === true) {
    // Make all others not default
    await Address.updateMany(
      {
        userId,
        _id: { $ne: newAddress._id }, // <-- VERY IMPORTANT FIX
      },
      { isDefault: false },
    );
  }

  res.status(201).json({
    message: "new address created successfully",
    data: newAddress,
  });
});

export const getAddresses = catchAsync(async (req, res, next) => {
  const { user } = req;
  console.log(user);

  const addresses = await Address.find({ userId: user._id });
  if (!addresses) return next(new AppError("cannot fetch addresses", 404));
  res
    .status(200)
    .json({ message: "addresses found successfully", data: addresses });
});

export const getAddressFromLocation = catchAsync(async (req, res, next) => {
  const { lat, lon } = req.query;

  // Step 2: Validate inputs
  if (!lat || !lon) {
    return res.status(400).json({
      error: "Missing required parameters",
      message: "Please provide both lat and lon query parameters",
    });
  }

  const fetchRes = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    {
      headers: {
        "User-Agent": "zmshop/1.0",
        Accept: "application/json",
      },
    },
  );

  if (!fetchRes.ok) {
    return res.status(404).json({
      error: "cannot fetch address from location",
    });
  }
  const data = await fetchRes.json();

  console.log(data);
  return res.status(200).json(data);
});

export const getAddress = getOne(Address);
export const deleteAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid address ID" });
  }

  // Find the address
  const address = await Address.findOne({ _id: id, userId: userId });
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  const isDefault = address.isDefault;

  // Delete this address
  await Address.findByIdAndDelete(id);

  // If it was default → choose a new default
  if (isDefault) {
    const anotherAddress = await Address.findOne({ userId: userId }).sort({
      createdAt: -1,
    }); // pick the newest

    if (anotherAddress) {
      anotherAddress.isDefault = true;
      await anotherAddress.save();
    }
    // If no addresses remain, then nothing to do
  }

  res.status(200).json({
    status: "Success",
    message: "Address deleted successfully",
  });
});
export const updateAddress = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const update = req.body;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid address ID" });
  }

  // Find the address and ensure it belongs to the user
  const address = await Address.findOne({ _id: id, user: userId });
  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  // --- RULE 1: If setting isDefault = true, unset others ---
  if (update.isDefault === true) {
    await Address.updateMany(
      { user: userId, _id: { $ne: id } },
      { isDefault: false },
    );
  }

  // --- RULE 2: If NOT setting default, ensure there is at least ONE default ---
  if (update.isDefault === false || update.isDefault === undefined) {
    const hasAnotherDefault = await Address.findOne({
      user: userId,
      _id: { $ne: id },
      isDefault: true,
    });

    // No default exists → force this one to be default
    if (!hasAnotherDefault) {
      update.isDefault = true;
    }
  }

  // Update
  const updatedAddress = await Address.findOneAndUpdate(
    { _id: id, user: userId },
    update,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: "Success",
    data: {
      updatedAddress,
    },
  });
});
