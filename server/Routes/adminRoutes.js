const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

router.use(express.json())
router.post("/addTourismGovernor",adminController.addTourismGovernor);
router.delete("/delete", adminController.deleteAccount);
router.get("/usernames", adminController.getAllUsernames);
router.put("/create", adminController.createAdmin);

module.exports = router;