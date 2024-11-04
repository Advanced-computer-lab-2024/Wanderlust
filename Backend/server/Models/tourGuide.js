const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  YOE: {
    type: Number,
    required: true,
  },
  previousWork: {
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
  IdURL: {
    type: String, // URL for ID document
  },
  certificatesURL: {
    type: String, // URL for certificates
  },
  photoURL: {
    type: String,
  },
});

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;
