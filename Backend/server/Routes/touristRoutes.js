const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  redeemPoints,
  updatePointsOnPayment,//doesnt have a route
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
  addProductToCart,
} = require("../Controllers/touristController");
const router = express.Router();

router.get("/getTourist", getTourist);
router.post("/createTourist/:userId", createTourist);
router.put("/updateTourist/:username", updateTourist);
router.get("/viewAll", viewAll);
router.put("/redeemPoints/:username", redeemPoints);

router.put("/addProductToWishlist/:productId", addProductToWishlist);
router.get("/getWishlist", getWishlist);
router.delete("/removeProductFromWishlist/:productId", removeProductFromWishlist);
router.put("/addProductToCart/:productId", addProductToCart);

module.exports = router;
