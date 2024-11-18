const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const Product = require("./Products");

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
  currency: {
    type: String,
    default: "EGP",
  },
  badge: { type: String, default: "Bronze" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: [String],
    default: [],
  },
  
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Tourist = mongoose.model("Tourist", touristSchema);

module.exports = Tourist;
