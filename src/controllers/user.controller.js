const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const jwtToken = require("../config/jwttoken");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const isFoundUser = await User.findOne({ email: email });
  if (!isFoundUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist");
  }
});

const validateLoginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    throw new Error(
      "User not registered with given email please try to sign up"
    );
  }
  const isValidUser = await findUser.isPasswordMatched(password);
  if (!isValidUser) {
    throw new Error("Please check your password or try reset password");
  } else {
    res.send({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: jwtToken.generateToken(findUser?._id),
    });
  }
});

module.exports = { createUser, validateLoginUserController };
