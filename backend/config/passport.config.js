import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "backend/models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return cb(null, user);
        }
        user = await User.findOne({
          email: profile.emails[0].value,
        });
        if (user) {
          user = await User.findOneAndUpdate(
            { email: profile.emails[0].value },
            { googleId: profile.id, isVerified: true },
          );
          return cb(
            new Error(
              "this email is already existing via another login method",
              user,
            ),
          );
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
          roles: [process.env.USER_ROLE_ID],
        });
      } catch (err) {
        cb(err, null);
      }
    },
  ),
);

export default passport;
