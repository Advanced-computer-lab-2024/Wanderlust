const express = require("express");
const router = express.Router();
const {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
} = require("../Controllers/advertiserController");

router.put("/createAdvertiserProfile/:userId", createAdvertiser);
router.get("/getAdvertiser", getAdvertiser);
router.get("/getAdvertiserByUsername", getAdvertiserByUsername);
router.put("/updateAdvertiser", updateAdvertiser);

module.exports = router;
