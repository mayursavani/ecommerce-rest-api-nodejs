const express = require("express");
const router = express.Router();
const {
  createUser,
  validateLoginUserController,
} = require("../controllers/user.controller");

router.post("/register", createUser);
router.post("/login", validateLoginUserController);

module.exports = router;
