const express = require("express");
const router = express.Router();
const admin = require('../Middleware/adminMiddleware');
const { authenticateUser  } = require('../Controllers/authController');
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
    activateDeactivateItinerary,
    flagItinerary,
    unflagItinerary
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
  //flag as inappropriate
  router.put('/itinerary/:id/flag', authenticateUser, admin, flagItinerary);
  //unflag as inappropriate
  router.put('/itinerary/:id/unflag', authenticateUser, admin, unflagItinerary);

  module.exports = router;