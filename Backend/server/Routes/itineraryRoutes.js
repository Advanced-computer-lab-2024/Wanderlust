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
    bookItinerary,
    cancelItineraryBooking,
    addComment,
    activateDeactivateItinerary
  } = require("../Controllers/ItineraryController");

  router.post("/createItinerary", createItinerary);
  router.get("/getItinerary", getItinerary);
  router.put("/updateItinerary", updateItinerary);
  router.delete("/deleteItinerary", deleteItinerary);
  router.get("/sortItineraries", sortItineraries);
  router.get("/searchItinerary", searchItinerary);
  router.get("/filterItineraries", filterItinerairies);
  router.get("/filterItinerariesByPref", filterItinerariesByPref);
  router.post('/bookItinerary',bookItinerary);
  router.delete("/cancelItineraryBooking/:bookingId", cancelItineraryBooking);
  router.post('/:itineraryId/comments', addComment);
  router.put('/:id/activateDeactivate', activateDeactivateItinerary);

  module.exports = router;