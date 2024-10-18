const express = require("express");
const router = express.Router();
const {
  createTourGuide,
  getTourGuide,
  updateTourGuide,
} = require("../Controllers/tourGuideController");

router.post("/create", createTourGuide);
router.get("/getprofile", getTourGuide);
router.put("/updateprofile", updateTourGuide);


module.exports = router;