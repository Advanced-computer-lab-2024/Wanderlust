const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');

router.use(express.json())
router.post("/addTourismGovernor",adminController.addTourismGovernor);
router.delete("/delete", adminController.deleteAccount);
router.get("/usernames", adminController.getAllUserDetails);
router.post("/create", adminController.createAdmin);
router.post("/login", adminController.adminLogin);
router.post("/profile", adminController.getAdminDetails);

module.exports = router;