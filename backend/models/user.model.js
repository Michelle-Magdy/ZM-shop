import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import Role from "./role.model.js";
import { log } from "console";
dotenv.config();

/**
 * User Schema for MongoDB
 *
 * @typedef {Object} User
 * @property {string} name - User's full name (required, min 4 characters)
 * @property {string} phone - User's phone number (must match Egyptian phone format: 01[0125]XXXXXXXX)
 * @property {string} gender - User's gender (enum: "male" or "female")
 * @property {string} email - User's email address (required, unique, must be valid email)
 * @property {string} password - User's password (required, must be strong, not selected by default)
 * @property {ObjectId[]} roles - Array of role references
 * @property {boolean} isDeleted - Soft delete flag (default: false, not selected by default)
 * @property {boolean} isVerified - Email verification status (default: false)
 * @property {Date} lastLogin - Last login timestamp (default: current date)
 * @property {Date} passwordChangedAt - Timestamp when password was last changed
 * @property {string} passwordResetToken - Token for password reset (not selected by default)
 * @property {Date} passwordResetExpiresAt - Expiration time for password reset token (not selected by default)
 * @property {string} verificationToken - Token for email verification (not selected by default)
 * @property {Date} verificationTokenExpiresAt - Expiration time for verification token (not selected by default)
 * @property {Date} createdAt - Document creation timestamp (auto-generated)
 * @property {Date} updatedAt - Document update timestamp (auto-generated)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
      minLength: 3,
      trim: true,
    },
    phone: {
      type: String,
      match: [/^01[0125]\d{8}$/, "Please enter a valid phone number"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      trim: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: [true, "This Email already exists"],
      required: [true, "User must have an email"],
    },
    password: {
      type: String,
      validate: [validator.isStrongPassword, "Please enter a strong password"],
      required: [true, "User must have a password"],
      select: false,
    },
    roles: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Role",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpiresAt: { type: Date, select: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now() - 1000;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  realPassword,
) {
  return await bcrypt.compare(enteredPassword, realPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedAtTimeStamp = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTTimeStamp < changedAtTimeStamp;
  }
  return false;
};

userSchema.methods.makeResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(process.env.RESET_PASSWORD_EXPRIRES_IN);

  this.passwordResetExpiresAt =
    Date.now() + Number(process.env.RESET_PASSWORD_EXPRIRES_IN);
  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ isDeleted: false });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
