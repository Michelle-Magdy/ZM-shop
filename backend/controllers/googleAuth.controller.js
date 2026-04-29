import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import Cart from "../models/cart.model.js";
import catchAsync from "../util/catchAsync.js";
import { createTokenAndSetCookie } from "../util/jwt.js";
import AppError from "../util/appError.js";
import { GOOGLE_REDIRECT_URI } from "../config/config.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";

// create google client
const client = new OAuth2Client({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI,
});

export const googleTokenAuth = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new AppError("no token provided", 400));
  // verify token with google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  if (!ticket) return next(new AppError("no google ticket", 400));

  const payload = ticket.getPayload();
  // Ensure token issuer is Google
  if (
    payload.iss !== "https://accounts.google.com" &&
    payload.iss !== "accounts.google.com"
  ) {
    return next(new AppError("Invalid token issuer", 400));
  }

  // Ensure email is verified by Google
  if (!payload.email_verified) {
    return next(new AppError("Google email not verified", 400));
  }
  let user = await User.findOne({ googleId: payload.sub }).populate("roles");
  if (!user) {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      // Link Google account to existing user
      existingUser.googleId = payload.sub;
      existingUser.isVerified = true;
      await existingUser.save();

      user = await User.findById(existingUser._id).populate("roles");
    } else {
      // create new user
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        isVerified: true,
        roles: [process.env.USER_ROLE_ID],
      });

      user = await User.findById(user._id).populate("roles");
      if (!user) {
        return next(new AppError("cannot find created user", 404));
      }
      await sendWelcomeEmail(payload.email, payload.name);
    }
  }

  await Promise.all([
    Cart.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { items: [] } },
      { upsert: true, new: true },
    ),
    Wishlist.findOneAndUpdate(
      { userId: user._id },
      { $setOnInsert: { items: [] } },
      { upsert: true, new: true },
    ),
  ]);

  // create token and set cookie
  createTokenAndSetCookie(user, res);
  res.status(200).json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
    },
  });
});
