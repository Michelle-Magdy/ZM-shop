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

  const cookieOptions = {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: expiresInDays * 24 * 60 * 60 * 1000,
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};
