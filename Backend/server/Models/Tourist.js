const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const touristSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  jobOrStudent: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  badge: { type: String, default: "None" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Tourist = mongoose.model("Tourist", touristSchema);

module.exports = Tourist;
