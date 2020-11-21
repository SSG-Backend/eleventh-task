module.exports = {
  showLogin: function (req, res, next) {
    res.render("login");
  },
  showWelcome: function (req, res, next) {
    const name = req.user.name;
    res.render("welcome", { name });
  },
};