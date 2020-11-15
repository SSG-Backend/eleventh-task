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

  const {id, provider: account_type} = profile;
  const {email, name, picture} = profile._json;
  const names = name.split(" ");
  const [firstname, lastname] = names;
  othernames = names.slice(2).join(" ");
  // log(profile);
  // return cb(profile);
  User.findOrCreate({
    id,
    email,
    name,
    firstname,
    lastname,
    othernames,
    account_type
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
  const {provider: account_type} = profile;
  const {email, id, first_name: firstname, picture, last_name: lastname, name, middle_name: othernames} = profile._json;
  // log(profile);
  // return cb(profile)
  User.findOrCreate({
    id,
    name,
    email,
    firstname,
    lastname,
    othernames,
    account_type
  }, function(error, user) {
    return cb(error, user);
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