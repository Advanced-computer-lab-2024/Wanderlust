const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
      },
      message: `Password must be at least 6 characters long and contain both letters in upper/lower caps and numbers.`,
    },
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  termsAccepted: {
    type: Boolean,
    required: [true, "You must accept the terms and conditions."],
  },
  role: {
    type: String,
    enum: ["guest", "tour guide", "advertiser", "seller", "tourist"],
    default: "guest",
  },
  roleApplicationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;