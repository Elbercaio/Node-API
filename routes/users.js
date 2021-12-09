const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");

router.post("/signup", usersController.signup);

router.post("/signin", usersController.signin);

module.exports = router;
