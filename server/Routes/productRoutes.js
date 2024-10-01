const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');

//put /api before the call
router.post('/addProduct', productController.addProduct);
router.put('/updateProductByName', productController.updateProductByName);
router.get('/searchProductByName', productController.searchProductByName);
router.get('/filterProductsByPrice', productController.filterProductsByPrice);


module.exports = router;