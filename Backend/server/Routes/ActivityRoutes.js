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
  sendActivityLinkViaEmail,
  rateActivity,
  bookActivity,
  cancelActivityBooking
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
router.post('/rate/:activityId', rateActivity);
router.post("/bookActivity", bookActivity);
router.delete("/cancelActivityBooking/:bookingId", cancelActivityBooking);

module.exports = router;
