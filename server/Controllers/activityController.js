const Activity = require("../Models/Activity.js");
const { default: mongoose, get } = require("mongoose");

const createActivity = async (req, res) => {
  const {
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
  } = req.body;

  try {
    // Ensure the category exists (if provided)
    if (category) {
      const activityCategory = await ActivityCategory.findById(category);
      if (!activityCategory) {
        return res.status(404).json({ error: "Activity category not found" });
      }
    }

    const activity = await Activity.create({
      date,
      time,
      location,
      price,
      category,
      tags,
      specialDiscounts,
      bookingOpen,
    });
    res.status(200).json(activity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const activities = await Activity.find().populate("category"); // Populating the category field
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

    // Ensure the category exists (if provided)
    if (category) {
      const activityCategory = await ActivityCategory.findById(category);
      if (!activityCategory) {
        return res.status(404).json({ error: "Activity category not found" });
      }
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      {
        date,
        time,
        location,
        price,
        category,
        tags,
        specialDiscounts,
        bookingOpen,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedActivity);
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

module.exports = {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
};
