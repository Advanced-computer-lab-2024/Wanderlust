const cloudinary = require("cloudinary").v2;
const tourGuide = require("../Models/tourGuide");
const mongoose = require("mongoose");

const saveTourGuideIdUrl = async (req, res) => {
  try {
    const { url, username } = req.body;
    if (!url) {
      return res.status(400).send("URL is required");
    }
    const updatedTourGuide = await tourGuide.findOneAndUpdate(
      { username: username }, // Search criteria
      { IdURL: url }, // Update operation
      { new: true } // Options
    );

    if (!updatedTourGuide) {
      return res.status(404).send("Tour guide not found");
    }
    res.status(200).json(idUrl);
  } catch (error) {
    console.error("Error updating tour guide ID URL:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { saveTourGuideIdUrl };
