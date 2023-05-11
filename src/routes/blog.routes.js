const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares/authentication");
const {
  createBlog,
  updateBlog,
  getBlog,
} = require("../controllers/blog.controller");

router.post("/create", middlewares.authMiddleware, createBlog);
router.put("/:id", middlewares.authMiddleware, updateBlog);
router.get("/:id", getBlog);

module.exports = router;
