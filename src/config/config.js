const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB: process.env.DB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
};
