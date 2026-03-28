const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

/* ======================
   GOOGLE STRATEGY
====================== */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

/* ======================
   FACEBOOK STRATEGY
====================== */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({
          $or: [{ facebookId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email,
          });
        } else if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
