const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // TODO : define the schema for a User with the following fields:
  name: { type: String, required: true },
  email: { type: String, required: true },
  skills: [String],
  address: { city: String, country: String },
  avatar: String
});

module.exports = mongoose.model("User", userSchema);
