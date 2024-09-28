// External variables
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
//Make sure to add your MongoDB URI in the .env file as MONGO_URI="your mongodb uri"
//Check db connection links in README file
const MongoURI = process.env.MONGO_URI;

//App variables
const app = express();
const port = process.env.PORT || "8000";

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
