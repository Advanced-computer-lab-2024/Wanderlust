const express = require("express");
const router = express.Router();
//const { createTourGuide } = require("../Controllers/tourGuideController");

const {
  getTourGuide,
  updateTourGuide,
  createTourGuideProfile,
  saveTourGuideIdUrl,
  rateTourGuide
} = require("../Controllers/tourGuideProfileController");

//router.put("/create/:userId", createTourGuide);
router.put("/createtgprofile/:userId", createTourGuideProfile);
router.get("/gettgprofile", getTourGuide);
router.put("/updatetgprofile", updateTourGuide);
router.put("/saveidurl", saveTourGuideIdUrl);
router.post('/rate/:tourGuideId', rateTourGuide);

module.exports = router;
