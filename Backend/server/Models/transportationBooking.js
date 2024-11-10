const mongoose = require('mongoose');




const transportationBookingSchema = new mongoose.Schema({
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

const transportationBooking = mongoose.model("TransportationBooking", transportationBookingSchema);

module.exports = transportationBooking;