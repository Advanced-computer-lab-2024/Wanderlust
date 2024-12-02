const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../Controllers/authController");
const {
  createActivity,
  getActivity,
  getActivityGuest,
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
  cancelActivityBooking,
  saveActivity,
  unsaveActivity,
  getSavedActivities,
  requestNotification,
  paymentSuccess,
} = require("../Controllers/activityController");

router.post("/createActivity", authenticateUser, createActivity);
router.get("/getActivity", getActivity);
router.get("/getActivityGuest", getActivityGuest);
router.get("/getActivityById", getActivityById);
router.put("/updateActivity", updateActivity);
router.delete("/deleteActivity", deleteActivity);
router.get("/filterActivities", filterActivities);
router.get("/sortActivities", sortActivities);
router.get("/searchActivity", searchActivity);
router.get("/activities", getActivitiesByCategoryName);
router.get("/share/:activityId", generateShareableLink);
router.post("/shareMail/:activityId/email", sendActivityLinkViaEmail);
router.post("/rate/:activityId", rateActivity);
router.post("/bookActivity", bookActivity);
router.post("/paymentSuccess", paymentSuccess);
router.delete("/cancelActivityBooking/:bookingId", cancelActivityBooking);
router.post('/saveActivity', saveActivity);
router.post('/unsaveActivity', unsaveActivity);
router.get('/savedActivities/:touristId', getSavedActivities);
router.post('/requestNotification', requestNotification);

module.exports = router;
