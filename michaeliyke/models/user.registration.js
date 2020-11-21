// function(exports, module, require, __filename, __dirname){

const User = require("./user.model");

module.exports = async function register(request, response, next) {
  // User.create(details).then(success).catch(error);
  const {name, email, password, repassword} = request.body;

  const data = {
    authorized: false,
    email: email,
    route: null,
    errorMessage: "Please provide all required details.",
    status: 400
  };

  if (!(name && email && password && repassword)) {
    response.status(200).json(data);
    response.end();
    return
  }

  if (password !== repassword) {
    data.errorMessage = "Passwords do not match.";
    response.status(200).json(data);
    response.end();
    return
  }
  const details = {
    name,
    email,
    password
  };

  const names = name.split(" ");
  if (names.length > 1) {
    details.firstname = names[0];
    details.lastname = names[1];
    details.othernames = names.splice(2).join(" ");
  }

  const user = await User.create(details);
  request.session.userId = user._id;
  data.authorized = true;
  data.authorization = user._id;
  data.successMessage = "You have been registered successfully";
  data.status = 200;
  data.route = "/dashboard";
  response.json(data);
  response.end();
};
// return module.exports
// }