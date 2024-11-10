const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
  advertiser: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Available'  // Can be 'Available', 'Booked', etc.
  }
});

const Transportation = mongoose.model('Transportation', transportationSchema);

module.exports = Transportation;
