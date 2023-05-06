const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const isFoundUser = await mongoose.model("User").findOne({ email: email });
  if (!isFoundUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error('User Already Exist')
  }
});

module.exports = { createUser };
