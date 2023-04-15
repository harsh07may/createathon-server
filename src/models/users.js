const mongoose = require("mongoose");
const db = require("../utils/connection");

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
