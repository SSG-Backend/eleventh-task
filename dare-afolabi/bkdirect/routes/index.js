var express = require('express');
const User = require('../models/User');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// GET home page.
router.get('/', function(req, res, next) {
  res.render('welcome');
});


// GET Dashboard
router.get('/dashboard', ensureAuthenticated, function(req, res, next) {

  let { email } = req.body;
  var authName = null;
  
  User.find({}, (error, result) => {
    if (error) {
      console.error(error);
      return null;
    }
    if (result != null) {
      // res.json(result);
      result.forEach(function(user) {
        if (user.email == email) {
          authName = user.name;
        }
      });
      res.render('dashboard', {users: result, name: authName});
    } else {
      res.json({});
    }
  });

  
});


module.exports = router;


