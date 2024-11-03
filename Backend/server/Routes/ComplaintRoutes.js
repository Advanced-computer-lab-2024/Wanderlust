const express = require('express');
const router = express.Router();
const ComplaintController = require('../Controllers/ComplaintController');
const { authenticateUser  } = require('../Controllers/authController');
const admin = require('../Middleware/adminMiddleware');


router.post('/complaint', authenticateUser, ComplaintController.createComplaint);//done 
router.put('/complaint/status', authenticateUser, admin, ComplaintController.updateComplaintStatus);//done
router.get('/complaints', authenticateUser, admin, ComplaintController.getAllComplaints);//dome 
router.get('/complaint/:id', authenticateUser, admin, ComplaintController.getComplaintById);//done 
router.get('/myComplaints', authenticateUser, ComplaintController.getComplaintsByUserId);//done

module.exports = router;

//run this command
//npm i jsonwebtoken

/*
create not yet working
so can't test status updatem
*/