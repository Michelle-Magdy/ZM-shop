import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../util/appError.js";
import catchAsync from "../util/catchAsync.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";
import { generateVerificationCode } from "../util/utils.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
} from "../mailtrap/emails.js";
import dotenv from "dotenv";
import { createTokenAndSetCookie } from "../util/jwt.js";

dotenv.config();

const formatUser = (user) => ({
  name: user.name,
  email: user.email,
  roles: user.roles?.map((r) => r.name) || [],
  addresses: user.addresses,
  password: undefined,
  isVerified: user.isVerified,
  gender: user.gender,
  phone: user.phone,
  id: user._id,
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password, rememberMe = false } = req.body;
  const user = await User.findOne({ email })
    .select("+password +isSuspended")
    .populate("roles");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (user.isSuspended) {
    return next(new AppError("Your account was suspended by admin.", 401));
  }

  user.lastLogin = new Date();

  createTokenAndSetCookie(user, res, rememberMe);
  res.status(200).json({
    status: "success",
    user: formatUser(user),
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiresAt: { $gte: Date.now() },
  });

  if (!user)
    return res.status(400).json({
      status: "failed",
      message: "invalid or expired verification code",
    });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiresAt = undefined;

  await user.save();
  const sentEmail = await sendWelcomeEmail(user.email, user.name);
  if (!sentEmail?.success) {
    return res.status(400).json({
      status: "failed",
      message: sentEmail?.error,
    });
  }
  return res.status(200).json({
    message: "Email verified successfully",
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const normailzedEmail = email.toLocaleLowerCase().trim();

  const existingUser = await User.findOne({
    email: normailzedEmail,
  });
  if (existingUser) throw new AppError("Email Already Exits", 409);

  // send email verification code
  const verificationCode = generateVerificationCode();
  const verificationTokenExpiresAt = Date.now() + 3 * 60 * 1000;

  const newUser = await User.create({
    name,
    email,
    password,
    verificationToken: verificationCode,
    verificationTokenExpiresAt,
    roles: [process.env.USER_ROLE_ID],
  });
  await newUser.populate("roles");
  newUser.password = undefined;

  //Create a cart for new user
  await Cart.create({ userId: newUser._id, items: [] });
  // create a wishlist for the new user
  await Wishlist.create({ userId: newUser._id, items: [] });
  // create token and set cookie
  // createTokenAndSetCookie(user, res);
  // send verification mail
  const sentEmail = await sendVerificationEmail(
    newUser.email,
    verificationCode,
  );
  if (!sentEmail?.success) {
    return res.status(400).json({
      status: "failed",
      message: sentEmail?.error,
    });
  }
  return res.status(201).json({
    status: "success",
    user: formatUser(newUser),
  });
});

export const logout = catchAsync((req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    status: "Success",
    message: "Logout successful.",
  });
});


export const protect = catchAsync(async (req, res, next) => {
  let token;
  // Debug: Log all cookies and headers
  console.log("🔐 Protect middleware - Request from:", req.headers.origin);
  console.log("📋 All cookies raw:", req.headers.cookie);
  console.log("🍪 Parsed cookies:", req.cookies);
  console.log("🔑 Auth header:", req.headers.authorization);
   console.log("Headers",req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("jwt:",req.cookies?.jwt);

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
      restrictedRoles.includes(name),
    );
    if (isAuthorized) return next();
    return next(new AppError("user is not authorized", 403));
  };
};

export const getCurrentUser = (req, res, next) => {
  if (!req.user) return next(new AppError("User is not authenticated", 401));
  res.status(200).json({
    status: "success",
    user: formatUser(req.user),
  });
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const normailzedEmail = email.toLocaleLowerCase().trim();
  const user = await User.findOne({ email: normailzedEmail });
  if (!user) {
    return next(new AppError("user not found", 404));
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

 const expiresIn =
   parseInt(process.env.RESET_PASSWORD_EXPIRES_IN, 10) || 600000;
 const passwordResetExpiresAt = new Date(Date.now() + expiresIn);
  user.passwordResetExpiresAt = passwordResetExpiresAt;

  await user.save({ validateBeforeSave: false });
  await sendResetPasswordEmail(
    user.email,
    user.name,
    `${process.env.NODE_ENV === "development" ? process.env.DEVELOPMENT_URL : process.env.PRODUCTION_URL}/reset-password/${resetToken}`,
  );
  res.status(200).json({
    message: "token sent successfully",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpiresAt: { $gte: Date.now() },
  });

  if (!user) return next(new AppError("forbidden to go to this route", 401));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();
  res.status(200).json({
    message: "password reset susccessfully",
    status: "success",
  });
});
