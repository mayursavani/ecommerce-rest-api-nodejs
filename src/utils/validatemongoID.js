const mongoose = require("mongoose");

const isValidMongoDBId = async (id) => {
  const valid = await mongoose.Types.ObjectId.isValid(id);
  if (!valid) {
    throw new Error("Please ennter valid id or ");
  }
};

module.exports = isValidMongoDBId;
