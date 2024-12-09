const express = require("express");
const router = express.Router();
const {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
  checkForFlagged
} = require("../Controllers/advertiserController");
const { createSystemNotification,sendUpcomingActivityNotifications, sendUpcomingItineraryNotifications, requestNotification,getNotificationsAll } = require("../Controllers/NotificationController");


router.put("/createAdvertiserProfile/:userId", createAdvertiser);
router.get("/getAdvertiser", getAdvertiser);
router.get("/getAdvertiserByUsername", getAdvertiserByUsername);
router.put("/updateAdvertiser", updateAdvertiser);
router.get("/checkForFlagged/:advertiserId", checkForFlagged);
router.get('/getNotifications', getNotificationsAll);


module.exports = router;
