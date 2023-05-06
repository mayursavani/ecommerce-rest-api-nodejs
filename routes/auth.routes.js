const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/user.controller");

router.post("/register", createUser);

module.exports = router;
