const jwt = require("jsonwebtoken");
const config = require("./config");

const generateToken = (id) => {
  return jwt.sign({ id }, config.SECRET_KEY, { expiresIn: "1d" });
};

module.exports = { generateToken };
