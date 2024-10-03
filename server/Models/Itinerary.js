const mongoose = require("mongoose");

// Define the schema for Activities
const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, // Activity location
  duration: { type: Number, required: true },
});

// Define the schema for Itinerary
const itinerarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Title of the itinerary
    activities: [activitySchema], // Array of activity sub-documents
    locations: [{ type: String, required: true }], // Locations to be visited
    timeline: {
      start: { type: Date, required: true }, // Start date and time of the itinerary
      end: { type: Date, required: true }, // End date and time of the itinerary
    },
    tag: [{
      type: mongoose.Types.ObjectId,
      ref: 'PreferenceTag', 
      required: true
    }],// Tags associated with the itinerary (array 34an akeed fe kaza tag)
    language: { type: String, required: true }, // Language of the tour
    price: { type: Number, required: true }, // Price of the tour
    availableDates: [{ type: Date, required: true }], // Available dates for the tour
    accessibility: { type: Boolean, default: false }, // Whether the tour is accessible
    pickupLocation: { type: String, required: true }, // Pick up location
    dropoffLocation: { type: String, required: true }, // Drop off location
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

// Create the Itinerary model
const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;
