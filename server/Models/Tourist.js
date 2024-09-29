const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TouristSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
});

const Tourist = mongoose.model("Tourist", TouristSchema);
module.exports = Tourist;
