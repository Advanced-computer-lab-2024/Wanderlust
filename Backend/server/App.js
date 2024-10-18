// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file

//calling for controllers
const { createUser } = require("./Controllers/userController");

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
// configurations
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

//Routes
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

app.use(express.json());
app.post("/createUser", createUser);

app.use(express.json());
app.post("/createLocation", createLocation);
app.get("/getLocations", getLocations);
app.put("/updateLocation/:id", updateLocation);

app.delete("/deleteLocation/:id", deleteLocation);
app.get('/getLocation/:id', getLocationById);


  //createLocation,
  //getLocations,
  //updateLocation,
  //deleteLocation,
  //filterLocations,