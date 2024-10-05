const express = require("express");
const router = express.Router();
const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  filterLocations,
} = require("../Controllers/LocationController");

router.get("/getLocations", getLocations);
router.post("/createLocation", createLocation);
router.put("/updateLocation/:name", updateLocation);
router.delete("/deleteLocation/:name", deleteLocation);
router.get("/filterLocations", filterLocations);

module.exports = router;
