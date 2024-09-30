const express = require('express');
const router = express.Router();
const { createActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController');



module.exports = router;
