const {HOST, PORT, ENV} = require("../configs/config");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const User = require("../models/user.model");
const express = require("express");

const router = express.Router();
const {log} = console;



router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (error, user) => {
    cb(error, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: ENV.GOOGLE_APP_ID,
  clientSecret: ENV.GOOGLE_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/google/cb",
  profileFields: ["id", "displayName", "name", "gender", "picture.type(large), email"]
}, function(accessToken, refreshToken, profile, cb) {

  const {id, provider} = profile;
  const {email, name} = profile._json;
  const [firstname, lastname, ...othernames] = name.split(" ");

  log(profile);
  log(accessToken)
  cb(profile);
  return profile;
  User.findOrCreate({
    googleId: profile.id
  }, function(error, user) {
    return cb(error, user);
  });
}));

passport.use(new FacebookStrategy({
  clientID: ENV.FACEBOOK_APP_ID,
  clientSecret: ENV.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/cb",
  profileFields: ["id", "displayName", "name", "gender", "picture.type(large), email"]
}, function(token, refreshToken, profile, cb) {
  const {email, id, first_name, last_name, name, middle_name} = profile._json;
  cb(profile);
  return log(profile._json);
  User.findOrCreate(profile.email, function(error, user) {
    if (error) {
      return cb(error);
    }
    return cb(null, user);
  });
}));



router.get("/auth/facebook/cb", passport.authenticate("facebook", {
  successRedirect: "/profile", // /dashboard or /
  failureRedirect: "/failed" // /login
}));

router.get("/auth/facebook", passport.authenticate("facebook", {
  scope: "email"
}));

router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/cb", passport.authenticate("google", {
  successRedirect: "/profile", // /dashboard or /
  failureRedirect: "/failed" // /login
}));



module.exports = router;