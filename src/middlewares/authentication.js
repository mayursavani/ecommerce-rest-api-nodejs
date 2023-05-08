const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = await jwt.verify(token, config.SECRET_KEY);
        const user = await User.findById(decoded.id);
        req.user = user;
        next();
      }
    } catch (err) {
      throw new Error("Not authorized token expired please login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user?.role === "admin" ? true : false;
  if (isAdmin) {
    next();
  } else {
    throw new Error("you are not an admin user");
  }
});

module.exports = { authMiddleware, isAdmin };
