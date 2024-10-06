const Activity = require("../Models/Activity.js");
const { default: mongoose, get } = require("mongoose");
const { findById } = require("../Models/tourGuide.js");

const createActivity = async (req, res) => {
  const {
    name,
    date,
    time,
    location,
    price,
    duration,
    rating,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
  } = req.body;
  try {
    const activity = await Activity.create({
      name,
      date,
      time,
      location,
      price,
      duration,
      rating,
      category,
      tags,
      specialDiscounts,
      bookingOpen,
    });
    const populatedActivity = await Activity.findById(activity._id)
      .populate("category")
      .populate("tags");
    res.status(200).json(populatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("category")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  const {
    id,
    date,
    time,
    location,
    price,
    duration,
    rating,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
  } = req.body;

  try {
    // Ensure the activity exists
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      {
        date,
        time,
        location,
        price,
        duration,
        rating,
        category,
        tags,
        specialDiscounts,
        bookingOpen,
      },
      { new: true, runValidators: true }
    );
    const populatedActivity = await Activity.findById(activity._id)
      .populate("category")
      .populate("tags");
    res.status(200).json(populatedActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteActivity = async (req, res) => {
  const { id } = req.body;

  try {
    await Activity.findByIdAndDelete(id);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//requirement 45
//get method (app.get)
// http://localhost:8000/api/activityRoutes/filterActivities
const filterActivities = async (req, res) => {
  try {
    const { budget, date, category, ratings } = req.body;

    const query = {
      ...(budget && { price: { $gte: budget.min, $lte: budget.max } }),
      ...(date && {
        date: { $gte: new Date(date.start), $lte: new Date(date.end) },
      }),
      ...(category && { category }),
      ...(ratings && { rating: { $gte: ratings.min } }),
    };

    const activities = await Activity.find(query);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sortActivities = async (req, res) => {
  try {
    const { sortBy, orderBy } = req.body;
    const activities = await Activity.find().sort({ [sortBy]: orderBy });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for Activity by name or tags
const searchActivity = async (req, res) => {
  const { query } = req.body;
  try {
    const activity = await Activity.find()
      .populate("tags")
      .populate("category");
    const filteredActivity = activity.filter((activity) => {
      const nameMatches = activity.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const tagMatches =
        activity.tags &&
        activity.tags.name.toLowerCase().includes(query.toLowerCase());
      const categoryMatches =
        activity.category &&
        activity.category.name.toLowerCase().includes(query.toLowerCase());
      return nameMatches || tagMatches || categoryMatches;
    });
    res.status(200).json(filteredActivity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  filterActivities,
  sortActivities,
  searchActivity,
};
