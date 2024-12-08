const express = require("express");
const router = express.Router();
const { fetchBookings , FetchUpcomingBookings } = require("../Controllers/BookingController");

router.get("/getBooking", fetchBookings);
router.get("/getUpcomingBooking", FetchUpcomingBookings);

module.exports = router;
