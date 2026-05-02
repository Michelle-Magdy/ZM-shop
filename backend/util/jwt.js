import jwt from "jsonwebtoken";

export const signToken = (id, rememberMe) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : process.env.JWT_EXPIRES_IN,
  });
};

export const createTokenAndSetCookie = (user, res, rememberMe = false) => {
  const token = signToken(user._id, rememberMe);

  const expiresInDays = rememberMe
    ? 30
    : parseInt(process.env.JWT_EXPIRES_IN) || 7;
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = {
    maxAge: expiresInDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};
