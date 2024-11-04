const express = require('express');
const router = express.Router();
const { createSeller, getSellers, updateSeller, deleteSeller,getSellerById } = require('../Controllers/sellerController');


router.put('/createSeller/:userId', createSeller);
router.get('/getSellers', getSellers);
router.get('/getSeller/:id', getSellerById);
router.put('/updateSeller/:id', updateSeller);
//router.delete('/deleteSeller/:name', deleteSeller);

module.exports = router;
