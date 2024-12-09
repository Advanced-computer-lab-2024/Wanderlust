// routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const { getFlightData } = require('../Controllers/flightController');


const {
  searchFlightOffers,
  priceFlightOffer,
  createFlightOrder,
} = require("../Controllers/flightController");



// Route to search for flight offers
router.post("/search", searchFlightOffers);

// Route to price a selected flight offer
router.post("/price", priceFlightOffer);

// Route to create a flight booking
router.post("/book", createFlightOrder);



module.exports = router;
