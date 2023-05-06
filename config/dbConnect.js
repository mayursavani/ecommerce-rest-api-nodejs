const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const config = require("./config");
const client = new MongoClient(config.MONGODB);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
