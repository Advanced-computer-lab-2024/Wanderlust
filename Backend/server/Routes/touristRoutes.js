const express = require("express");
const {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  redeemPoints,
  updatePointsOnPayment, //doesnt have a route
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
  addProductToCart,
  removeProductFromCart,
  changeCartItemQuantity,
  checkoutOrder,
  cardPaymentSuccess,
  viewAllOrders,
  viewOrder,
  cancelOrder,
  getCart,
  addDeliveryAddress,
  removeDeliveryAddress,
  updateDeliveryAddress,
  deliveryAddresses,
  usePromoCode,
  receiveBirthdayPromo,
  testOutOfStockNotification

} = require("../Controllers/touristController");

const { authenticateUser } = require("../Controllers/authController");
const tourist = require("../Middleware/touristMiddleware");
const { createSystemNotification,sendUpcomingActivityNotifications, sendUpcomingItineraryNotifications, requestNotification,getNotifications } = require("../Controllers/NotificationController");

const router = express.Router();

router.get("/getTourist", getTourist);
router.post("/createTourist/:userId", createTourist);
router.put("/updateTourist/:username", updateTourist);
router.get("/viewAll", viewAll);
router.put("/redeemPoints/:username", redeemPoints);

router.put("/addProductToWishlist/:productId", addProductToWishlist);
router.get("/getWishlist", getWishlist);
router.get("/getCart", getCart);
router.delete(
  "/removeProductFromWishlist/:productId",
  removeProductFromWishlist
);
router.put("/addProductToCart/:productId", addProductToCart);
//new
router.delete(
  "/removeFromCart/:productId",
  authenticateUser,
  tourist,
  removeProductFromCart
);
router.put(
  "/cart/changeQuantity/:productId",
  authenticateUser,
  tourist,
  changeCartItemQuantity
);
router.post("/cart/checkout", authenticateUser, tourist, checkoutOrder);
router.post(
  "/cart/paymentSuccess",
  authenticateUser,
  tourist,
  cardPaymentSuccess
);
router.get("/viewAllOrders", authenticateUser, tourist, viewAllOrders);
router.get("/viewOrder/:orderId", authenticateUser, tourist, viewOrder);
router.delete(
  "/cancelOrder/:touristId/:orderId",
  authenticateUser,
  tourist,
  cancelOrder
);
router.put("/updatePointsOnPayment", updatePointsOnPayment);
router.post("/testOutOfStockNotification", testOutOfStockNotification);

//addresses
router.post(
  "/addDeliveryAddress",
  authenticateUser,
  tourist,
  addDeliveryAddress
);
router.delete(
  "/removeDeliveryAddress/:addressId",
  authenticateUser,
  tourist,
  removeDeliveryAddress
);
router.put(
  "/updateDeliveryAddress/:addressId",
  authenticateUser,
  tourist,
  updateDeliveryAddress
);
router.get("/deliveryAddresses", authenticateUser, tourist, deliveryAddresses);
router.post(
  "/usePromoCode/:touristId",
  authenticateUser,
  tourist,
  usePromoCode
);
router.post(
  "/receiveBirthdayPromo/:touristId",
  authenticateUser,
  tourist,
  receiveBirthdayPromo
);
router.post("/createSystemNotification", createSystemNotification);

// Endpoint to trigger event notifications
router.post('/send-activity-notifications', async (req, res) => {
  try {
    await sendUpcomingActivityNotifications();
    res.status(200).send('Event notifications sent successfully.');
  } catch (error) {
    res.status(500).send('Error sending event notifications.');
  }
});

// Endpoint to trigger itinerary notifications
router.post('/send-itinerary-notifications', async (req, res) => {
  try {
    await sendUpcomingItineraryNotifications();
    res.status(200).send('Itinerary notifications sent successfully.');
  } catch (error) {
    res.status(500).send('Error sending itinerary notifications.');
  }
});
router.post('/request-notification', requestNotification);
router.get('/get-notifications', getNotifications);
const cron = require('node-cron');


// Schedule to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log("Running daily notification tasks...");
  await sendUpcomingActivityNotifications();
  await sendUpcomingItineraryNotifications();
});
// For testing, add temporary routes to invoke the functions
router.get('/test-activities', async (req, res) => {
  try {
    await sendUpcomingActivityNotifications();
    res.status(200).json({ message: 'Activity notifications sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-itineraries', async (req, res) => {
  try {
    await sendUpcomingItineraryNotifications();
    res.status(200).json({ message: 'Itinerary notifications sent.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
