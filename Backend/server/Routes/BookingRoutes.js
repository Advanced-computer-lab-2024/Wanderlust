const express = require("express");
const router = express.Router();
const { fetchBookings , fetchUpcomingBookings , fetchPastBookings} = require("../Controllers/BookingController");

router.get("/getBooking", fetchBookings);
router.get("/getUpcomingBooking", fetchUpcomingBookings);
router.get("/getPastBooking", fetchPastBookings);


module.exports = router;
