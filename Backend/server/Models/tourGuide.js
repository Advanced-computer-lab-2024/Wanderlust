//const { string, number } = require('joi');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const tourGuideSchema = new Schema({
  YOE: {
    type: Number,
    required: true,
  },
  previousWork: {
    type: String,
  },
  IdURL: {
    type: String, // URL for ID document
  },
  certificatesURL: {
    type: String, // URL for certificates
  },
});

// Merge the schemas
const TourGuide = User.discriminator("TourGuide", tourGuideSchema);

module.exports = TourGuide;
