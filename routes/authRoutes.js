const express = require("express");
const router = express.Router();
const passport = require("passport");

const AuthController = require("../controllers/AuthController");

// auth with google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// auth callback with google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  AuthController.redirectWelcome
);
// logout
router.get("/logout", AuthController.logout);

// auth with facebook
router.get("/facebook", passport.authenticate("facebook"));

// auth callback with facebook
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  AuthController.redirectWelcome
);
module.exports = router;