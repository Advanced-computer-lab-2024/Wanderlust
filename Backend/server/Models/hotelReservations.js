const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelReservationsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },

  cityCode: {
    type: String,
    required: true,
  },

  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  priceTotal: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  numberOfRooms: {
    type: Number,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
  },
  offerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const HotelReservations = mongoose.model(
  "HotelReservations",
  hotelReservationsSchema
);
module.exports = HotelReservations;
