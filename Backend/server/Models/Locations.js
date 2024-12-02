const mongoose = require("mongoose");

const locationsSchema = new mongoose.Schema({
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TourismGovernor', 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  pictures: { type: String },  // Store the image URL
  location: { type: String, required: true },
  openingHours: { type: String, required: true },
  ticketPrices: { type: Number, required: true },
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: "PreferenceTag", // Reference to PreferenceTag model
  }],
});

const Locations = mongoose.model("Locations", locationsSchema);
module.exports = Locations;
