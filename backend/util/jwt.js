import jwt from "jsonwebtoken";

export const signToken = (id, rememberMe) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : process.env.JWT_EXPIRES_IN,
  });
};

export const createTokenAndSetCookie = (user, res, rememberMe = false) => {
  const token = signToken(user._id, rememberMe);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (rememberMe ? 30 : parseInt(process.env.JWT_EXPIRES_IN)) *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true, // prevent xss
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevent csrf
    maxAge: 30 * 60 * 60 * 1000, //! edit this for refresh tokens
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};
