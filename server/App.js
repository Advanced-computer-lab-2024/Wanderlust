// External variables
const express = require("express");
const mongoose = require("mongoose");
const tourist = require("./Routes/touristRoutes");
require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file

const {createTourGuide,getTourGuide, updateTourGuide, deleteTourGuide} = require("./Routes/tourGuideController");


const {createAdvertiser,
  getAdvertiser,
  updateAdvertiser,
  deleteAdvertiser} = require("./Routes/advertiserController");


//calling admin controllers
const { createAdmin, deleteAccount, getAllUsernames, addTourismGovernor } = require("./Routes/adminController");


const MongoURI =
  "mongodb+srv://alimousa2003:33Dt6AmBI1uV9DG7@mernapp.l0tdo.mongodb.net/?retryWrites=true&w=majority&appName=MernApp";

//App variables
const app = express();
const port = process.env.PORT || "8000";

app.use(express.json());
app.use("/api/tourist", tourist);

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


app.use(express.json())
app.post("/createtgprofile",createTourGuide);
app.get("/gettgprofile", getTourGuide);
app.put("/updatetgprofile", updateTourGuide);
app.delete("/deletetgprofile", deleteTourGuide);


app.use(express.json())
app.post("/createAdvertiserProfile",createAdvertiser);
app.get("/getAdvertiser", getAdvertiser);
app.put("/updateAdvertiser", updateAdvertiser);


app.use(express.json())
//routes
app.post("/admin/addTourismGovernor",addTourismGovernor);
app.delete("/admin/delete", deleteAccount);
app.get("/admin/usernames", getAllUsernames);
app.put("/admin/create", createAdmin);

