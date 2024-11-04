const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  roleApplicationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  IdURL: {
    type: String,
  },
  taxationRegistryCardURL: {
    type: String,
  },
  logoURL: {
    type: String,
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

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
