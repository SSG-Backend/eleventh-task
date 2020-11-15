// function(exports, module, require, __filename, __dirname) {

module.exports = async function logout(request, response, next) {
  const { SESSION_NAME } = process.env;
  try {
    await request.session.destroy();
  } catch (error) {
    return response.redirect("/home");
  }
  response.clearCookie(SESSION_NAME);
  response.redirect("/login");
};

// return module.expports
// }

