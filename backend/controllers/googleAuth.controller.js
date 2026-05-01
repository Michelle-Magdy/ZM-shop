import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import Cart from "../models/cart.model.js";
import catchAsync from "../util/catchAsync.js";
import { createTokenAndSetCookie } from "../util/jwt.js";
import AppError from "../util/appError.js";
import { GOOGLE_REDIRECT_URI } from "../config/config.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";

// ✅ For ID token verification, just pass the client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ If you also need authorization code flow (separate client)
// const authClient = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   GOOGLE_REDIRECT_URI,
// );

export const googleTokenAuth = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError("no token provided", 400));
  }

  try {
    console.log("Verifying Google token...");
    console.log(
      "Client ID:",
      process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...",
    );
    console.log("Token:", token.substring(0, 50) + "...");

    // ✅ Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
      return next(new AppError("Google verification failed", 400));
    }

    const payload = ticket.getPayload();
    console.log("Google user:", {
      email: payload.email,
      sub: payload.sub,
      iss: payload.iss,
    });

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
        // Create new user
        user = await User.create({
          googleId: payload.sub,
          name: payload.name,
          email: payload.email,
          isVerified: true,
          roles: [process.env.USER_ROLE_ID],
        });

        user = await User.findById(user._id).populate("roles");

        if (!user) {
          return next(new AppError("Failed to create user", 404));
        }

        // Send welcome email (don't await if it might fail)
        sendWelcomeEmail(payload.email, payload.name).catch((err) =>
          console.error("Welcome email failed:", err),
        );
      }
    }

    // Create cart and wishlist if they don't exist
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

    // Create token and set cookie
    createTokenAndSetCookie(user, res);
    // Debug: Check if cookie was set
    console.log("Response headers:", res.getHeaders());

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles?.map((r) => r.name) || [],
      },
    });
  } catch (error) {
    console.error("Google auth error details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return next(
      new AppError(`Google authentication failed: ${error.message}`, 401),
    );
  }
});
