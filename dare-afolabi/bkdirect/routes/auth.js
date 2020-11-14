var express = require('express');
const users = require('../controllers/users');
const passport = require('passport'); // try to remove
var router = express.Router();


// Login Option Page
router.get('/login', users.getLoginOptions);


// Email Login Page
router.get('/login/email', users.getLoginPage);


// Auth with Google
router.get('/google', users.getGoogleAuth);


// Redirect for Google auth
router.get('/google/redirect', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log(req.user);
        res.redirect('/dashboard');
    }
);


// Auth with Facebook
router.get('/facebook', users.getFacebookAuth);


// Redirect for Google auth
router.get('/facebook/redirect', 
    passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
    function(req, res) {
        // Successful authentication, redirect to dashboard.
        console.log(req.user);
        res.redirect('/dashboard');
    }
);


// Register Page
router.get('/register', users.getRegistrationPage);


// Add (Registration) User
router.post('/register', users.addUser);


// Login Handler
router.post('/login', users.userLogin);


//Logout Handler
router.get('/logout', users.userLogout);


module.exports = router;

