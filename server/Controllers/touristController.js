const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const { default: mongoose } = require("mongoose");

const getTourist = async (req, res) => {
  const username = req.query.username;
  const tourist = await touristModel.findOne({ username: username });
  res.status(200).json(tourist);
};

const createTourist = async (req, res) => {
  const {
    username,
    email,
    password,
    mobileNumber,
    nationality,
    dateOfBirth,
    job,
  } = req.body;
  try {
    const tourist = await touristModel.create({
      username,
      email,
      password,
      mobileNumber,
      nationality,
      dateOfBirth,
      job,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  try {
    const touristId = req.params.touristId;
    const {
      username,
      email,
      password,
      mobileNumber,
      nationality,
      dateOfBirth,
      job,
    } = req.body;
    const tourist = await touristModel.findByIdAndUpdate(
      touristId,
      {
        username,
        email,
        password,
        mobileNumber,
        nationality,
        dateOfBirth,
        job,
      },
      { new: true }
    );
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewAll = async (req, res) => {
  const locations = await locationsModel.find().populate("tags");
  const activity = await activityModel
    .find()
    .populate("category")
    .populate("tags");
  const itinerary = await itineraryModel.find().populate("activities");
  res.status(200).json({ locations, activity, itinerary });
};

module.exports = {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  searchAll,
};
