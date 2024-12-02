const express = require("express");
const router = express.Router();
const { searchHotels, bookHotel } = require("../Controllers/hotelController");
router.get("/searchHotels", searchHotels);
router.post("/bookHotel", bookHotel);

module.exports = router;
