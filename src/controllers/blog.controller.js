const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoId = require("../utils/validatemongoID");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (err) {
    throw new Error(err);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const updateBlog = await Blog.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updateBlog);
  } catch (err) {
    throw new Error(err);
  }
});

const getBlog = asyncHandler(async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createBlog, updateBlog, getBlog };
