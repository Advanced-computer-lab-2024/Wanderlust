const express = require("express");
const router = express.Router();
const {
  createTourGuide,

} = require("../Controllers/tourGuideController");

const {
  getTourGuide,
  updateTourGuide,
  createTourGuideProfile,

} = require("../Controllers/tourGuideProfileController");

router.put("/create/:userId", createTourGuide);
router.post("/createtgprofile", createTourGuideProfile);
router.get("/gettgprofile", getTourGuide);
router.put("/updatetgprofile", updateTourGuide);



module.exports = router;