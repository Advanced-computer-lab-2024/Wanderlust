const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const hotelReservationsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotelName: {
    type: String,
  },
  hotelAddress: {
    type: {
      description: {
        type: String,
      },
      countryCode: {
        type: String,
      },
    },
  },

  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
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
