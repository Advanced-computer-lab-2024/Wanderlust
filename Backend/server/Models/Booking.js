// Models/Booking.js
const mongoose = require("mongoose");
const Itinerary = require("./Itinerary");

const BookingSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity", // Reference to the Activity model
  },
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
