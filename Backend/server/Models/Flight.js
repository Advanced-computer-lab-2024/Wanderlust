const mongoose = require("mongoose");

const flightReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flightOfferId: {
    type: String,
    required: true,
  },
  departure: {
    airport: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  arrival: {
    airport: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  price: {
    currency: { type: String, required: true },
    total: { type: String, required: true },
  },
  passengers: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, required: true },
      contact: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FlightReservation = mongoose.model(
  "FlightReservation",
  flightReservationSchema
);

module.exports = FlightReservation;
