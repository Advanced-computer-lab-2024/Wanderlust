const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiserSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  hotline: {
    type: String,
    required: true,
  },
  companyProfile: {
    type: String,
    required: true,
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

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;