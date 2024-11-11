const express = require("express");
const router = express.Router();
const { fetchBookings } = require("../Controllers/BookingController");

router.get("/getBooking", fetchBookings);

module.exports = router;
