const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
} = require("../Controllers/activityController");
router.post("/createActivity", createActivity);
router.get("/getActivity", getActivity);
router.put("/updateActivity/:id", updateActivity);
router.delete("/deleteActivity/:id", deleteActivity);

module.exports = router;
