// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file

//calling for controllers
const {
  createTourGuide,
  getTourGuide,
  updateTourGuide,
  deleteTourGuide,
} = require("./Controllers/tourGuideController");
const {
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
} = require("./Controllers/advertiserController");
//new
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("./Controllers/ActivityCatController");

const MongoURI =
  "mongodb+srv://alimousa2003:33Dt6AmBI1uV9DG7@mernapp.l0tdo.mongodb.net/?retryWrites=true&w=majority&appName=MernApp";

//App variables
const app = express();
const port = process.env.PORT || "8000";

app.use(express.json());
app.use(cors());
// configurations
// Mongo DB
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
//const ActivityCategoryRoutes = require("./Routes/ActivityCategoryRoutes");
const activityRoutes = require("./Routes/ActivityRoutes");

//Routes
app.use("/api/tourist", touristRoutes);
app.use("/api/product", productRoutes);
app.use("/api", adminRoutes);
//app.use("/api", ActivityCategoryRoutes);
app.use(bodyParser.json());
app.use("/api", preferenceTagRoutes);
app.use("/api/activity", activityRoutes);

//routes for tour guide
app.use(express.json());
app.post("/createtgprofile", createTourGuide);
app.get("/gettgprofile", getTourGuide);
app.put("/updatetgprofile", updateTourGuide);
app.delete("/deletetgprofile", deleteTourGuide);
//routes for advertiser
app.use(express.json());
app.post("/createAdvertiserProfile", createAdvertiser);
app.get("/getAdvertiser", getAdvertiser);
app.get("/getAdvertiserByUsername", getAdvertiserByUsername);
app.post("/getAdvertiserByUsername", getAdvertiserByUsername);
app.put("/updateAdvertiser", updateAdvertiser);
//routes for activity

//routes for activity category
app.use(express.json());
app.post("/createCategory", createCategory);
app.get("/getCategories", getCategories);
app.put("/updateCategory", updateCategory);
app.delete("/deleteCategory", deleteCategory);
