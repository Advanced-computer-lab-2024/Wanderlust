const express = require("express");
const router = express.Router();
const {
  addProduct,
  updateProductByName,
  searchProductByName,
  filterProductsByPrice,
  getProductsSortedByRating,
  viewAllProducts,
  viewAvailableProducts,
  deleteProductByName,
  archiveProduct,
  unarchiveProduct,
  rateProduct,
  viewProductDetails,
  addSale,
} = require("../Controllers/productController");
const { authenticateUser  } = require('../Controllers/authController');
const tourist = require('../Middleware/touristMiddleware');
const admin = require('../Middleware/adminMiddleware');
const adminOrSeller = require('../Middleware/sellerOrAdminMiddleware');

//put /api before the call
router.post("/addProduct", addProduct);
router.put("/updateProductByName", updateProductByName);
router.get("/searchProductByName", searchProductByName);
router.get("/filterProductsByPrice", filterProductsByPrice);
router.get("/sortedByRating", getProductsSortedByRating);
router.get("/viewAllProducts", viewAllProducts);
router.get("/viewAvailableProducts", viewAvailableProducts);
router.delete("/deleteproduct", deleteProductByName);
router.put("/archiveProduct", archiveProduct);
router.put("/unarchiveProduct", unarchiveProduct);
router.post('/product/rate', rateProduct);
router.get('/product/:productId/details', authenticateUser, adminOrSeller, viewProductDetails);
//extra
router.post('/product/sale', addSale);


module.exports = router;
