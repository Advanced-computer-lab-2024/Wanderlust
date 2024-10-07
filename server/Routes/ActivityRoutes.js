const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  filterActivities,
  sortActivities,
  searchActivity,
} = require("../Controllers/activityController");
router.post("/createActivity", createActivity);
router.get("/getActivity", getActivity);
router.put("/updateActivity", updateActivity);
router.delete("/deleteActivity", deleteActivity);
router.get("/filterActivities", filterActivities);
router.get("/sortActivities", sortActivities);
router.get("/searchActivity", searchActivity);
module.exports = router;
