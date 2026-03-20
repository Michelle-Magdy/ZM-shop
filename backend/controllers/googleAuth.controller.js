import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import Cart from "../models/cart.model.js";
import catchAsync from "../util/catchAsync.js";
import { createTokenAndSetCookie } from "../util/jwt.js";
import AppError from "../util/appError.js";
import { Palette } from "lucide-react";

// create google client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// redirect user to google
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false, // we don't use session we use jwt
});

export const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login/error=google_failed`,
    session: false,
  }),
  catchAsync(async (req, res) => {
    const user = req.user;
    await Promise.all([
      Cart.findOneAndUpdate(
        {
          userId: user._id || user.id,
        },
        {
          $setOnInsert: { items: [] },
        },
        {
          upsert: true,
        },
      ),
      Wishlist.findOneAndUpdate(
        {
          userId: user._id,
        },
        {
          $setOnInsert: { items: [] },
        },
        { upsert: true },
      ),
    ]);
    // set cookie and redirect
    createTokenAndSetCookie(user, res);

    // redirect to frontend success page
    res.redirect(`${process.env.CLIENT_URL}`);
  }),
];

export const googleTokenAuth = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(new AppError("not token provided", 400));
  // verify token with google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  if (!ticket) return next(new AppError("no google ticket"), 400);

  const payload = ticket.getPayload();
  let user = await User.findOne({ googleId: payload.sub }).populate("roles");
  if (!user) {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return next(
        new AppError(
          "email already registered,please log in wih password",
          409,
        ),
      );
    }

    // create new user
    user = await User.create({
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      isVerified: true,
      roles: [process.env.USER_ROLE_ID],
    });
    console.log(user);

    user = await User.findById(user._id).populate("roles");
    if (!user) {
      return next(new AppError("cannot find created user", 404));
    }

    await Cart.create({ userId: user._id, items: [] });
    await Wishlist.create({ userId: user._id, items: [] });
  }

  // send welcome email
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
