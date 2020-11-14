const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });


passport.use(new GoogleStrategy({
    clientID: "970021706449-d0ojkn3pbvspnad2su6d9cmfatcv03ho.apps.googleusercontent.com",
    clientSecret: "8JEPg635v3GYr-Fwk5i9VolO",
    callbackURL: "http://localhost:3000/google/callback/"
  },

  function(accessToken, refreshToken, profile, done) {
  
      return done(null, profile);

  }
));