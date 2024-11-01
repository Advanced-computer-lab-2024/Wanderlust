const touristModel = require("../Models/Tourist");
const locationsModel = require("../Models/Locations");
const activityModel = require("../Models/Activity");
const itineraryModel = require("../Models/Itinerary");
const { default: mongoose } = require("mongoose");
const User = require("../Models/user");

const getTourist = async (req, res) => {
  const username = req.query.username;
  try {
    const tourist = await touristModel
      .findOne({ username: username })
      .populate("userId");
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTourist = async (req, res) => {
  const { userId } = req.params;
  const { nationality, DOB, jobOrStudent } = req.body;
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
    user.roleApplicationStatus = "approved";
    await tourist.save();
    res.status(200).json({
      tourist,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTourist = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    var { username } = req.params;
    const { email, password, mobileNumber, ...touristData } = req.body;

    // Find the User by username
    const user = await User.findOne({ username }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }
    // Define fields to update in User
    const userUpdates = {};
    if (email) userUpdates.email = email;
    if (password) userUpdates.password = password;
    if (mobileNumber) userUpdates.mobileNumber = mobileNumber;

    // Update User within the session
    const updatedUser = await User.findByIdAndUpdate(user._id, userUpdates, {
      new: true,
      session,
    });

    // Update Tourist within the session
    const updatedTourist = await touristModel
      .findOneAndUpdate({ userId: user._id }, touristData, {
        new: true,
        session,
      })
      .populate("userId");

    if (!updatedTourist) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Tourist not found for this user" });
    }

    await session.commitTransaction();
    res.status(200).json({ updatedUser, updatedTourist });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
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
const redeemPoints = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({
      username: username,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourist = await touristModel.findOne({
      userId: user._id,
    });
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }
    let cash = Math.floor(tourist.points / 10000) * 100;
    tourist.wallet += cash;
    tourist.points -= (cash / 100) * 10000;
    updateBadge(tourist);
    await tourist.save();
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Utility function or a method in your Tourist model
const updatePointsOnPayment = async (touristId, amountPaid) => {
  const tourist = await touristModel.findById(touristId);

  if (!tourist) throw new Error("Tourist not found");

  // Determine the level based on current points
  let level;
  if (tourist.points <= 100000) level = 1;
  else if (tourist.points <= 500000) level = 2;
  else level = 3;

  // Calculate additional points based on level
  let pointsEarned;
  if (level === 1) pointsEarned = amountPaid * 0.5;
  else if (level === 2) pointsEarned = amountPaid * 1;
  else pointsEarned = amountPaid * 1.5;

  // Update total points
  tourist.points += pointsEarned;
  updateBadge(tourist);
  // Save changes
  await tourist.save();
  return { points: tourist.points, badge: tourist.badge, level };
};
const updateBadge = (tourist) => {
  // Update the badge based on the new points total
  if (tourist.points <= 100000) tourist.badge = "Bronze";
  else if (tourist.points <= 500000) tourist.badge = "Silver";
  else tourist.badge = "Gold";
};
module.exports = {
  getTourist,
  createTourist,
  updateTourist,
  viewAll,
  redeemPoints,
};
