const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const UserController = require("../controllers/UserController");

// show login page
router.get("/", auth.ensureGuest, UserController.showLogin);

// show welcome page
router.get("/welcome", auth.ensureAuth, UserController.showWelcome);

module.exports = router;