const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleKeys = require('./keys').google;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


passport.use(
    new GoogleStrategy(
        {
            // options for the Google strategy
            clientID: googleKeys.clientID,
            clientSecret: googleKeys.clientSecret,
            callbackURL: googleKeys.callbackURL,
        },
        function(accessToken, refreshToken, profile, done) {
            // passport callback function

            User.findOne({ authId: 'google:' + profile.id })
                .then(user => {
                    if(user) {
                        // User exists
                        // errors.push({msg: 'User already exist'});
                        done(null, user);


                    } else {
                        const newUser = new User({
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            authId: 'google:' + profile.id,
                            email: profile._json.email
                        });
                        newUser.save()
                            .then(user => {
                                // req.flash('success_msg', 'Logging in with Google was successful');
                                // res.redirect('/dashboard');
            
                                console.log('new user created: ' + user);
                                done(null, user);
                            })
                            .catch(err => console.log(err));
                    }
                })
            

        }
    )
)


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


