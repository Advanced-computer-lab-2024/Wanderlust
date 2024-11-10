const mongoose = require('mongoose');
 // models/Booking.js


// Assuming you have Advertiser and Tourist (User) models already
const Advertiser = require("./Advertiser");
const Tourist = require("./Tourist");

const BookingSchema = new mongoose.Schema({
  // Reference to the Advertiser (who is offering the transportation)
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser", // Reference to the Advertiser model
    required: true,
  },
  
  // Reference to the Tourist (who is booking the transportation)
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist", // Reference to the Tourist model
    required: true,
  },
  
 
  },
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;