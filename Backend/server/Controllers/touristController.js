const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const { default: mongoose } = require("mongoose");
const User = require("../Models/user");

const getTourist = async (req, res) => {
  const username = req.query.username;
  const tourist = await touristModel.findOne({ username: username });
  res.status(200).json(tourist);
};

const createTourist = async (req, res) => {
  const { userId } = req.params;
  const { nationality, DOB, jobOrStudent} = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourist = new touristModel({
      userId: user._id,
      nationality,
      DOB,
      jobOrStudent,
    });
    user.role = "tourist";
    user.roleApplicationStatus = "approved";
    await tourist.save();
    await user.save();
    res.status(200).json({
      user,
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  const { touristId } = req.params;
  const { email, mobileNumber, nationality, jobOrStudent } = req.body;

  try {
    const updatedFields = { email, mobileNumber, nationality, jobOrStudent };
    const tourist = await touristModel.findByIdAndUpdate(
      touristId,
      updatedFields,
      { new: true }
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
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
};
