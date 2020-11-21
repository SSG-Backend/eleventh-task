module.exports = {
  redirectWelcome: function (req, res, next) {
    res.redirect("/welcome");
  },
  logout: function (req, res, next) {
    req.logout();
    res.redirect("/");
  },
};
