const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  getActivityById,
  filterActivities,
  sortActivities,
  searchActivity,
  getActivitiesByCategoryName,
  generateShareableLink,
  sendActivityLinkViaEmail
} = require("../Controllers/activityController");

router.post("/createActivity", createActivity);
router.get("/getActivity", getActivity);
router.get("/getActivityById", getActivityById);
router.put("/updateActivity", updateActivity);
router.delete("/deleteActivity", deleteActivity);
router.get("/filterActivities", filterActivities);
router.get("/sortActivities", sortActivities);
router.get("/searchActivity", searchActivity);
router.get('/activities', getActivitiesByCategoryName);
router.get('/share/:activityId', generateShareableLink);
router.post('/shareMail/:activityId/email', sendActivityLinkViaEmail);

module.exports = router;
