const express = require("express");
const router = express.Router();
const admin = require("../Middleware/adminMiddleware");
const { authenticateUser } = require("../Controllers/authController");
const tourist = require("../Middleware/touristMiddleware");
const {
  createItinerary,
  getItinerary,
  getItineraryGuest,
  updateItinerary,
  deleteItinerary,
  sortItineraries,
  searchItinerary,
  filterItinerairies,
  filterItinerariesByPref,
  bookItinerary,
  cardPaymentSuccess,
  cancelItineraryBooking,
  addComment,
  activateDeactivateItinerary,
  flagItinerary,
  unflagItinerary,
  rateItinerary,
  generateShareLink,
  saveItinerary,
  unsaveItinerary,
  getSavedItineraries
} = require("../Controllers/ItineraryController");

router.post("/createItinerary", createItinerary);
router.get("/getItinerary", getItinerary);
router.get("/getItineraryGuest", getItineraryGuest);
router.put("/updateItinerary", updateItinerary);
router.delete("/deleteItinerary", deleteItinerary);
router.get("/sortItineraries", sortItineraries);
router.get("/searchItinerary", searchItinerary);
router.get("/filterItineraries", filterItinerairies);
router.get("/filterItinerariesByPref", filterItinerariesByPref);
router.post("/bookItinerary", bookItinerary);
router.post("/cardPaymentSuccess", cardPaymentSuccess);
router.delete("/cancelItineraryBooking/:bookingId", cancelItineraryBooking);
router.post("/:itineraryId/comments", addComment);
router.put("/:id/activateDeactivate", activateDeactivateItinerary);
router.get("/itineraries/:itineraryId/share", generateShareLink);
//flag as inappropriate
router.put("/itinerary/:id/flag", authenticateUser, admin, flagItinerary);
//unflag as inappropriate
router.put("/itinerary/:id/unflag", authenticateUser, admin, unflagItinerary);
// Tourist rate an itinerary they followed
router.post("/itinerary/rate", authenticateUser, tourist, rateItinerary);
router.post('/itinerary/saveItinerary', saveItinerary);
router.post('/itinerary/unsaveItinerary', unsaveItinerary);
router.get('/itinerary/savedItineraries', getSavedItineraries);

module.exports = router;
