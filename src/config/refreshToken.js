const jwt = require("jsonwebtoken");
const config = require("./config");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, config.SECRET_KEY, { expiresIn: "3d" });
};

module.exports = generateRefreshToken;
