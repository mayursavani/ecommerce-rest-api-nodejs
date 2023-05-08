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
const middlewares = require("../middlewares/authentication");

router.post("/register", createUser);
router.post("/login", validateLoginUserController);
router.get("/all-users", middlewares.authMiddleware, getAllUser);
router.get("/get", middlewares.authMiddleware, getUser);
router.delete("/delete", middlewares.authMiddleware, deleteUser);
router.put("/update", middlewares.authMiddleware, updateUser);

module.exports = router;
