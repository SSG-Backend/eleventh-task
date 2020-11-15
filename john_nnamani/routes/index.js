var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate = require('../authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Oauth' });
});

router.get('/welcome/:user', function(req, res, next) {
    res.render('welcome', { title: 'Oauth', user: req.params.user});
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
        res.redirect('/welcome/'+req.user.username);
    });

router.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/welcome/'+req.user.username);
    });

module.exports = router;
