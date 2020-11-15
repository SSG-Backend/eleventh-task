// function(exports, module, require, __filename, __dirname){
const path = require("path");
const User = require("./user.model");
const {log} = console;

module.exports = function login(request, response, next) {
  // store MongoDB userId (_id) in the request.session.userId
  const {email, password, details} = request.body;

  log(details)
  User.authenticate(email, password, (error, user) => {
    //response.setHeader("Content-Type", "application/json");
    const data = {
      authorized: false,
      email: email,
      route: "/login",
      status: 200
    };
    if (user && user.authenticated === true) {
      request.session.userId = user._id;
      data.authorized = true;
      data.authorization = user._id;
      data.route = "/home";
      data.successMessage = "Login successful. <br /> Redirecting to your dashboard. . ";
      response.status(200).json(data);
    } else if (user) {
      data.errorMessage = "Incorrect password, did you forget your password?";
      response.status(200).json(data);
    } else {
      data.status = 404;
      data.errorMessage = `An account with (<b>${email}</b>) does not exist, would you like to <a href="/register">create it</a>?`;
      data.route = "/register";
      response.status(200).json(data);
    }
    response.end();

  });
};

// return module.exports
// }