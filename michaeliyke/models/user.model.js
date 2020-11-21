const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const PassportPortLocalMongoose = require("passport-local-mongoose");
const {log} = console;

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    default: mongoose.Types.ObjectId()
  },
  account_type: {
    type: String,
    default: "email"
  }, // email || facebook || google || twitter || linkedin
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: false
  },
  firstname: {
    type: String,
    default: ""
  },
  lastname: {
    type: String,
    default: ""
  },
  othernames: {
    type: String,
    default: ""
  },
  admin: {
    type: Boolean,
    default: false
  }
});




UserSchema.pre("save", function(next) {
  const user = this;
  if (!this.password && this.account_type != "email") {
    log(this);
    next();
  }
  bcrypt.hash(user.password || null, 10, function(error, hash) {
    if (error) {
      return next(error);
    }
    user.password = hash;
    next();
  });
});

UserSchema.statics.exists = async function exists(email, fn) {
  return await User.findOne({
      email
    }).exec();
};


UserSchema.statics.authenticate = function authenticate(email, password, fn) {
  User.findOne({
    email: email
  }).exec((error, user) => {
    if (error) {
      return fn(error);
    } else if (!user) {
      const error = new Error("User does not exist!");
      error.status = 401;
      return fn(error);
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (result === true) {
        user.authenticated = true;
        return fn(null, user);
      } else {
        user.authenticated = false;
        return fn(null, user);
      }
    });
  });
};

UserSchema.plugin(PassportPortLocalMongoose);
UserSchema.plugin(findOrCreate);
const User = mongoose.model("User", UserSchema);
module.exports = User;