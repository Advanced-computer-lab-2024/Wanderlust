const express = require("express");
const router = express.Router();
const { 
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary,
    sortItineraries,
    searchItinerary,
    filterItinerairies,
    filterItinerariesByPref,
    getExchangeRates
  } = require("../Controllers/ItineraryController");

  router.post("/createItinerary", createItinerary);
  router.get("/getItinerary", getItinerary);
  router.put("/updateItinerary", updateItinerary);
  router.delete("/deleteItinerary", deleteItinerary);
  router.get("/sortItineraries", sortItineraries);
  router.get("/searchItinerary", searchItinerary);
  router.get("/filterItineraries", filterItinerairies);
  router.get("/filterItinerariesByPref", filterItinerariesByPref);
  router.get('/exchangeRates', getExchangeRates);


  module.exports = router;