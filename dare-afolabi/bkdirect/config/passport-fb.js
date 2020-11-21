const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const facebookKeys = require('./keys').facebook;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


passport.use(
    new FacebookStrategy(
        {
            // options for the Facebook strategy
            clientID: facebookKeys.appID,
            clientSecret: facebookKeys.appSecret,
            callbackURL: facebookKeys.callbackURL,
            profileFields: ['email', 'name']
        },
        function(accessToken, refreshToken, profile, done) {
            // passport callback function

            User.findOne({ authId: 'facebook:' + profile.id })
                .then(user => {
                    if(user) {
                        // User exists
                        // errors.push({msg: 'User already exist'});
                        done(null, user);


                    } else {
                        const newUser = new User({
                            name: profile.name.givenName + ' ' + profile.name.familyName,
                            authId: 'facebook:' + profile.id,
                            email: profile._json.email
                        });
                        newUser.save()
                            .then(user => {
                                // req.flash('success_msg', 'Logging in with Facebook was successful');
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


