const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  filterActivities,
  sortActivities,
} = require("../Controllers/activityController");
router.post("/createActivity", createActivity);
router.get("/getActivity", getActivity);
router.put("/updateActivity/:id", updateActivity);
router.delete("/deleteActivity", deleteActivity);
router.get("/filterActivities", filterActivities);
router.get("/sortActivities", sortActivities);
module.exports = router;
