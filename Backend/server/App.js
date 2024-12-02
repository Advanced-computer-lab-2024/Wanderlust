// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const cron = require('node-cron');

//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file

//calling for controllers

const { signUp } = require('./Controllers/userController');
const { sendNotifications } = require('./services/notificationService');

const {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  filterLocations,
  getLocationById,
} = require("./Controllers/LocationController");

const {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
} = require("./Controllers/advertiserController");
//new

//App variables
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

cron.schedule('0 * * * *', () => {
  sendNotifications();
});
// configurations

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Mongo DB
const port = process.env.PORT || "8000";
const MongoURI =
  "mongodb+srv://alimousa2003:33Dt6AmBI1uV9DG7@mernapp.l0tdo.mongodb.net/?retryWrites=true&w=majority&appName=MernApp";
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

//routes initialisation
const preferenceTagRoutes = require("./Routes/PreferenceTagRoutes");
const productRoutes = require("./Routes/productRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const touristRoutes = require("./Routes/touristRoutes");
const activityRoutes = require("./Routes/ActivityRoutes");
const locationRoutes = require("./Routes/locationsRoutes");
const tourGuideRoutes = require("./Routes/tourGuideRoutes");
const advertiserRoutes = require("./Routes/advertiserRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const sellerRoutes = require("./Routes/sellerRoutes");
const itineraryRoutes = require("./Routes/itineraryRoutes");
const bookingRoutes = require("./Routes/BookingRoutes");
const hotelRoutes = require("./Routes/hotelRoutes");
const guideRoutes = require('./Routes/guideRoutes'); 


const transportationRoutes = require("./Routes/transportationRoutes");
const ComplaintRoutes = require("./Routes/ComplaintRoutes");

const documentRoutes = require("./Routes/documentsRoutes");
const { login } = require("./Controllers/authController");

const flightRoutes = require("./Routes/flightRoutes");

//Routes
app.use('/api', guideRoutes);
app.use("/api/tourist", touristRoutes);
app.use("/api/product", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/preferenceTag", preferenceTagRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/tourGuide", tourGuideRoutes);
app.use("/api/advertiser", advertiserRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api", flightRoutes);
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use("/api/Complaint", ComplaintRoutes);

app.use("/api/documents", documentRoutes);
app.use("/api/transportation", transportationRoutes);

app.use(express.json());
app.post("/signup", signUp);

app.use(express.json());
app.post("/createLocation", createLocation);
app.get("/getLocations", getLocations);
app.put("/updateLocation/:id", updateLocation);

app.delete("/deleteLocation/:id", deleteLocation);
app.get("/getLocation/:id", getLocationById);

app.post("/login", login);
//createLocation,
//getLocations,
//updateLocation,
//deleteLocation,
//filterLocations,
