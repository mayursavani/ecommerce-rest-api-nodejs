const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const jwtToken = require("../config/jwttoken");
const jwt = require("jsonwebtoken");
const isValidMongoDBId = require("../utils/validatemongoID");
const generateRefreshToken = require("../config/refreshToken");
const config = require("../config/config");
const { sendEmail } = require("./email-sender.controller");
const crypto = require("crypto");

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
    const refreshToken = generateRefreshToken(findUser._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      sameSite: true,
      secure: true,
    });
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
  const id = req.user._id;
  isValidMongoDBId(id);
  try {
    const user = await User.findOne({ _id: id });
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

//delete a single user

const deleteUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  isValidMongoDBId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (err) {
    throw new Error(err);
  }
});

//update a user
const updateUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  isValidMongoDBId(id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
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

//block user
const blockUser = asyncHandler(async (req, res) => {
  isValidMongoDBId(req.params.id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        active: false,
      },
      { new: true }
    );
    res.json(blockUser);
  } catch {}
});

//unblock user

const unblockUser = asyncHandler(async (req, res) => {
  isValidMongoDBId(req.params.id);
  try {
    const unblockUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        active: true,
      },
      { new: true }
    );
    res.json(unblockUser);
  } catch (err) {
    throw new Error(err);
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("refresh token not found in cookies");
  }
  const user = await User.find({ refreshToken: cookie.refreshToken });
  if (!user) {
    throw new Error("Refresh token not matches with the user");
  }
  const decoded = await jwt.verify(cookie.refreshToken, config.SECRET_KEY);
  if (!decoded || jwt.decode.id !== user._id) {
    throw new Error("There is something wrong with refresh token.");
  }
  const accessToken = jwtToken.generateToken(user.id);
  res.json({ accessToken });
});

//logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("refresh token not found in cookies");
  }
  const user = await User.findOne({ refreshToken: cookie.refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: true,
    secure: true,
  });
  res.sendStatus(204);
});

//reset password
const updatePassword = asyncHandler(async (req, res) => {
  isValidMongoDBId(req.user._id);
  const user = await User.findById(req.user._id);
  if (req.body.password) {
    user.password = req.body.password;
    const updatedUser = await user.save({ new: true });
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

//forgot-password-token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new Error("User not found with the provided email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = ` Hi, Follow this link to reset password. This link is valid till 10 minutes. 
    <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here</a>`;
    const data = {
      to: req.body.email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data, req, res);
    res.json(token);
  } catch (err) {
    throw new Error(err);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  if (!req.params.token || !req.body.password) {
    throw new Error("required parameter password or token is missing");
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Either invalid Token or Token expired");
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();
  res.json(user);
});

module.exports = {
  createUser,
  validateLoginUserController,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
