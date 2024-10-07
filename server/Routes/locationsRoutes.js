const express = require("express");
const router = express.Router();
const {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  filterLocations,
  getLocationById,
  searchLocations,
} = require("../Controllers/LocationController");

router.get("/getLocations", getLocations);
router.post("/createLocation", createLocation);
router.get("/getLocation/:id", getLocationById);
router.put("/updateLocation/:id", updateLocation);
router.delete("/deleteLocation/:id", deleteLocation);
router.get("/filterLocations", filterLocations);
router.get("/searchLocations", searchLocations);

module.exports = router;
