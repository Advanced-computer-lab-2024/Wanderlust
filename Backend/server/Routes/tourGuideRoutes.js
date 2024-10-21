const express = require("express");
const router = express.Router();
const { createTourGuide } = require("../Controllers/tourGuideController");

const {
  getTourGuide,
  updateTourGuide,
  createTourGuideProfile,
  saveTourGuideIdUrl,
} = require("../Controllers/tourGuideProfileController");

router.post("/create", createTourGuide);
router.post("/createtgprofile", createTourGuideProfile);
router.get("/gettgprofile", getTourGuide);
router.put("/updatetgprofile", updateTourGuide);
router.put("/saveidurl", saveTourGuideIdUrl);

module.exports = router;
