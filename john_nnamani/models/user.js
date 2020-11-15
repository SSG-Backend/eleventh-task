var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    facebookId: String,
    googleId: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);