const tourGuideModel = require("../Models/tourGuideProfile.js");
const { default: mongoose, get } = require("mongoose");

const createTourGuideProfile = async (req, res) => {
  const username = req.query.userName;
  if (!username) {
    return res
      .status(400)
      .json({ error: "userName query parameter is required" });
  }
  const { YOE, mobileNumber, previousWork } = req.body;
  tourGuideModel.userName = username;
  try {
    const tourguide = await tourGuideModel.create({
      YOE,
      mobileNumber,
      previousWork,
    });
    res.status(200).json(tourguide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTourGuide = async (req, res) => {
  const username = req.query.userName;
  if (!username) {
    return res
      .status(400)
      .json({ error: "userName query parameter is required" });
  }

  try {
    const tourguide = await tourGuideModel.findOne({ userName: username });
    if (!tourguide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    res.status(200).json(tourguide);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateTourGuide = async (req, res) => {
  const { userName } = req.body;
  const { mobileNumber, YOE, previousWork } = req.body;
  try {
    const tourGuide = await tourGuideModel.findOneAndUpdate(
      { userName },
      { mobileNumber, YOE, previousWork },
      { new: true }
    );
    res.status(200).json(tourGuide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const saveTourGuideIdUrl = async (req, res) => {
  try {
    const { url, username } = req.body;
    if (!url) {
      return res.status(400).send("URL is required");
    }
    const updatedTourGuide = await tourGuideModel.findOneAndUpdate(
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

module.exports = {
  createTourGuideProfile,
  getTourGuide,
  updateTourGuide,
  saveTourGuideIdUrl,
};
