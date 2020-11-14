const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');


module.exports.getLoginPage = function(req, res) {
    res.render('loginemail');
};


module.exports.getLoginOptions = function(req, res) {
    res.render('login');
};


module.exports.getFacebookAuth = function(req, res, next) {
    // handle with passport
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] })(req, res, next);
};


module.exports.getGoogleAuth = function(req, res, next) {
    // handle with passport
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};


module.exports.getRegistrationPage = function(req, res) {
    res.render('register');
};


// Registration Handler
module.exports.addUser = function(req, res) {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }
    
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }
    
    if(password.length < 8){
        errors.push({msg: 'Password should be at least 8 characters'});
    }
    
    if(errors.length > 0){
        res.render('register', {
        errors,
        name,
        email,
        password,
        password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
        if(user) {
            // User exists
            errors.push({msg: 'Email is already registered'});
            res.render('register', {
            errors,
            name,
            email,
            password,
            password2
            });
        } else {
            const newUser = new User({
            name,
            email,
            password
            });
    
            // Hash password
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, 
            (err, hash) => {
                if(err) throw err;
                // Set password to hashed
                newUser.password = hash;
                //Save user
                newUser.save()
                .then(user => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/auth/login');
                })
                .catch(err => console.log(err));
            }))
    
        }
        });
    }
};


// Login Handler
module.exports.userLogin = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};


// Logout Handler
module.exports.userLogout = function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
};


