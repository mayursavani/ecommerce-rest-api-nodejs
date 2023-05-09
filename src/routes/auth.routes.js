const express = require("express");
const router = express.Router();
const {
  createUser,
  validateLoginUserController,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
} = require("../controllers/user.controller");
const middlewares = require("../middlewares/authentication");

router.post("/register", createUser);
router.post("/login", validateLoginUserController);
router.get(
  "/all-users",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  getAllUser
);
router.get("/get-user", middlewares.authMiddleware, getUser);
router.delete("/delete-user", middlewares.authMiddleware, deleteUser);
router.put("/update-user", middlewares.authMiddleware, updateUser);
router.patch(
  "/block-user/:id",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  blockUser
);
router.patch(
  "/unblock-user/:id",
  middlewares.authMiddleware,
  middlewares.isAdmin,
  unblockUser
);

module.exports = router;
