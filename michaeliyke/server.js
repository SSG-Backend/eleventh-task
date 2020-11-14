const {HOST, PORT, ENV} = require("./configs/config");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookiePaser = require("cookie-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const findOrCreate = require("mongoose-findorcreate");
const User = require("./models/user.model");

const {log} = console;


const app = express();

app.set("view engine", "ejs");

mongoose.connect(`mongodb://127.0.0.1:27017/${ENV.DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;

app.use(session({
  name: ENV.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: ENV.SESSION_SECRETE,
  cookie: {
    maxAge: ENV.SESSION_LIFETIME,
    sameSite: true,
    secure: ENV.IN_PROD
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(passport.initialize());
app.use(passport.session());

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



app.get("/", (request, response) => {
  response.render("index");
});

app.get("/auth/facebook/cb", passport.authenticate("facebook", {
  successRedirect: "/profile", // /dashboard or /
  failureRedirect: "/failed" // /login
}));

app.get("/auth/facebook", passport.authenticate("facebook", {
  scope: "email"
}));

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/cb", passport.authenticate("google", {
  successRedirect: "/profile", // /dashboard or /
  failureRedirect: "/failed" // /login
}));

app.get("/profile", (request, response) => {
  response.send("Welcome to your profile");
  response.end();
});

app.get("/failed", (request, response) => {
  response.send("Authentication failed!");
  response.end();
});

app.use((request, response, next) => {
  response.status(404)
  response.end();
})

app.listen(ENV.PORT, () => {
  log("Server On", HOST + ":" + PORT);
});