const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../Controllers/authController");
const admin = require('../Middleware/adminMiddleware');
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
  cardPaymentSuccess,
  flagActivity,
  unflagActivity,
} = require("../Controllers/activityController");
const { checkForFlagged } = require("../Controllers/advertiserController");

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
router.post("/paymentSuccess", cardPaymentSuccess);
router.delete("/cancelActivityBooking/:bookingId", cancelActivityBooking);
router.post("/saveActivity", saveActivity);
router.post("/unsaveActivity", unsaveActivity);
router.get("/savedActivities", getSavedActivities);
//flag an activity
router.put("/activity/:id/flag", authenticateUser, admin, flagActivity, checkForFlagged);
//unflag an activity
router.put("/activity/:id/unflag", authenticateUser, admin, unflagActivity);


module.exports = router;
