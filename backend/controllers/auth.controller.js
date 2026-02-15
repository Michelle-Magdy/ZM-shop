import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";

const formatUser = (user) => ({
  name: user.name,
  email: user.email,
  roles: user.roles?.map(r => r.name) || [],
  addresses: user.addresses,
});

const signToken = (id, rememberMe) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, rememberMe, statusCode, res) => {
  const token = signToken(user._id, rememberMe);
  const cookieOptions = {
    expires: new Date(Date.now() + (rememberMe ? 30 : parseInt(process.env.JWT_EXPIRES_IN)) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    user: formatUser(user)
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password, rememberMe = false } = req.body;
  const user = await User.findOne({ email }).select("+password").populate("roles");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  user.password = undefined;

  createAndSendToken(user, rememberMe, 200, res);
});

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    roles: [process.env.USER_ROLE_ID],
  });
  user.password = undefined;

  //Create a cart for new user
  await Cart.create({ userId: user._id, items: [] });
  // create a wishlist for the new user
  await Wishlist.create({ userId: user._id, items: [] });

  createAndSendToken(user, 201, res);
});

export const logout = catchAsync((req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  res.status(200).json({
    status: "Success",
    message: "Logout successful."
  })
})

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).populate("roles");
  if (!currentUser) {
    return next(new AppError("User no longer exist", 404));
  }

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(new AppError("User changed his password", 401));
  }

  req.user = currentUser;
  next();
});

export const authorize = (...restrictedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || req.user.roles.length === 0) {
      return next(new AppError("Authentication required.", 401));
    }
    const userRoles = req.user.roles;

    const isAuthorized = userRoles.some(({ name }) =>
      restrictedRoles.includes(name)
    );
    if (isAuthorized) return next();
    return next(new AppError("user is not authorized", 403));
  };
};

export const getCurrentUser = (req, res, next) => {
  if (!req.user)
    return next(new AppError("User is not authenticated", 401));
  res.status(200).json({
    status: "success",
    user: formatUser(req.user)
  })
}

//! CONTINUE RESET PASSWORD AND SENDING EMAILS

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  const resetToken = user.makeResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const mailUrl = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;
  // SEND EMAIL
  res.status(200).json({
    message: "token sent successfully",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.resetToken;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) return next(new AppError("forbidden to go to this route", 401));
  const { password } = req.body;
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createAndSendToken(user, 200, res);
});
