const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

//put /api before the call
router.post('/addProduct', productController.addProduct);
router.put('/updateProductByName', productController.updateProductByName);


module.exports = router;