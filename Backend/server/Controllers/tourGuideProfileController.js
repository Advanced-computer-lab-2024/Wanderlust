const tourGuideModel = require("../Models/tourGuideProfile.js");
const { default: mongoose, get } = require("mongoose");
const User = require("../Models/user");

const createTourGuideProfile = async (req, res) => {
  const { userId } = req.params;
  const { YOE, previousWork, IdURL, certificatesURL } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourGuide = new tourGuideModel({
      userId: user._id,
      YOE,
      previousWork,
      IdURL,
      certificatesURL,
    });
    user.role = "tour guide";
    user.roleApplicationStatus = "pending";
    await tourGuide.save();
    await user.save();
    res.status(200).json({
      user,
      tourGuide: {
        _id: tourGuide._id,
        YOE: tourGuide.YOE,
        previousWork: tourGuide.previousWork,
        IdURL: tourGuide.IdURL,
        certificatesURL: tourGuide.certificatesURL,
        createdAt: tourGuide.createdAt,
        updatedAt: tourGuide.updatedAt,
        __v: tourGuide.__v,
      },
    });
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
  const { username } = req.body;
  const { mobileNumber, YOE, previousWork } = req.body;
  try {
    const tourGuide = await tourGuideModel.findOneAndUpdate(
      { username },
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
// Rate and comment on a tour guide
const rateTourGuide = async (req, res) => {
  const { tourGuideId } = req.params;
  const { userId, rating, comment } = req.body;
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  try {
    const tourGuide = await tourGuideModel.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newRating = {
      userId: user._id,
      rating,
      comment,
    };
    if (!tourGuide.ratings) {
      tourGuide.ratings = [];
    }
    tourGuide.ratings.push(newRating);
    // Update the average rating
    const totalRatings = tourGuide.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    tourGuide.averageRating = totalRatings / tourGuide.ratings.length;
    await tourGuide.save();
    res.status(200).json({ message: 'Rating and comment added successfully', tourGuide });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = {
  createTourGuideProfile,
  getTourGuide,
  updateTourGuide,
  saveTourGuideIdUrl,
  rateTourGuide
};
