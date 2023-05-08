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
      role: findUser?.role,
      token: jwtToken.generateToken(findUser?._id),
    });
  }
});

//all users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
  const users = await User.find();
});

// get single user

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

//delete a single user

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.json(deleteUser);
  } catch (err) {
    throw new Error(err);
  }
});

//update a user
const updateUser = asyncHandler(async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createUser,
  validateLoginUserController,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
};
