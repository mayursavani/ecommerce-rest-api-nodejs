const express = require("express");
const router = express.Router();
const {
  createUser,
  validateLoginUserController,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

router.post("/register", createUser);
router.post("/login", validateLoginUserController);
router.get("/all-users", getAllUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

module.exports = router;
