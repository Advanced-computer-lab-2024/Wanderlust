const express = require("express");
const router = express.Router();
const {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
} = require("../Controllers/advertiserController");

router.post("/createAdvertiserProfile", createAdvertiser);
router.get("/getAdvertiser", getAdvertiser);
router.get("/getAdvertiserByUsername", getAdvertiserByUsername);
router.put("/updateAdvertiser", updateAdvertiser);

module.exports = router;
