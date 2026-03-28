const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

/* =====================
   EMAIL AUTH
===================== */
router.post("/register", authController.register);
router.post("/login", authController.login);

/* =====================
   CURRENT USER
===================== */
router.get("/me", auth, authController.getMe);

/* =====================
   GOOGLE AUTH
===================== */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login.html",
  }),
  authController.socialLogin
);

/* =====================
   FACEBOOK AUTH
===================== */
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login.html",
  }),
  authController.socialLogin
);

module.exports = router;
