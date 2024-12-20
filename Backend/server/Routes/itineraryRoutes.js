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
  getSavedItineraries,
  getItineraryAdmin
} = require("../Controllers/ItineraryController");
const { checkForFlagged } = require("../Controllers/tourGuideController");

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
router.get("/itineraryAdmin", getItineraryAdmin);
//flag as inappropriate
router.put("/itinerary/:id/flag", authenticateUser, admin, flagItinerary,checkForFlagged);
//unflag as inappropriate
router.put("/itinerary/:id/unflag", authenticateUser, admin, unflagItinerary);
// Tourist rate an itinerary they followed
router.post("/itinerary/rate", authenticateUser, tourist, rateItinerary);
router.post('/saveItinerary', saveItinerary);
router.post('/unsaveItinerary', unsaveItinerary);
router.get('/savedItineraries', getSavedItineraries);


module.exports = router;
