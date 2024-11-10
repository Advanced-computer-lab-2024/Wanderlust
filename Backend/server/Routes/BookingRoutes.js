const express = require("express");
const router = express.Router();
const { fetchBookings } = require('../Controllers/BookingContoller');

router.get("/getBooking", fetchBookings);


module.exports = router;
