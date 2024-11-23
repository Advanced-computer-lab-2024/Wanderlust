const tourGuideModel = require("../Models/tourGuide.js");
const { default: mongoose, get } = require("mongoose");
const User = require("../Models/user");
const jwt = require('jsonwebtoken');
const createTourGuideProfile = async (req, res) => {
  const { userId } = req.params;
  const { YOE, previousWork } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tourGuide = new tourGuideModel({
      userId: user._id,
      YOE,
      previousWork,
    });
    user.role = "tourguide";
    user.roleApplicationStatus = "pending";
    await tourGuide.save();
    await user.save();
    res.status(200).json({
      user,
      tourGuide,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
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
  const {mobileNumber, YOE, previousWork } = req.body;
  console.log(req.body);
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    var tourGuide = await tourGuideModel.findById(decoded.id);
    const user = await User.findById(tourGuide.userId);
    console.log(user);
    console.log(tourGuide);
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }
    user.mobileNumber = mobileNumber;
    await user.save();
    tourGuide.YOE = YOE;
    tourGuide.previousWork = previousWork;
    await tourGuide.save();
    res.status(200).json({tourGuide , user});
    
  } catch (error) {
    console.error("Error updating tour guide:", error);
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

const getSalesReport = async (req, res) => {
  const { tourGuideId } = req.params;

  try {
    const activities = await Activity.find({ tourGuideId });

    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for this tour guide." });
    }

    const totalRevenue = activities.reduce((sum, activity) => sum + activity.revenue, 0);

    res.status(200).json({ totalRevenue, activities });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(400).json({ error: error.message });
  }
};

const filterSalesReport = async (req, res) => {
  const { tourGuideId } = req.params;
  const { activityName, itinerary, startDate, endDate } = req.query;

  try {
    let query = { tourGuideId };

    if (activityName) query.activityName = activityName;
    if (itinerary) query.itinerary = itinerary;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const activities = await Activity.find(query);

    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for the given filters." });
    }

    const totalRevenue = activities.reduce((sum, activity) => sum + activity.revenue, 0);

    res.status(200).json({ totalRevenue, activities });
  } catch (error) {
    console.error("Error filtering sales report:", error);
    res.status(400).json({ error: error.message });
  }
};

const getTouristReport = async (req, res) => {
  const { tourGuideId } = req.params;

  try {
    const activities = await Activity.find({ tourGuideId });

    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for this tour guide." });
    }

    const totalTourists = activities.reduce((sum, activity) => sum + activity.totalTourists, 0);

    res.status(200).json({ totalTourists, activities });
  } catch (error) {
    console.error("Error fetching tourist report:", error);
    res.status(400).json({ error: error.message });
  }
};

const filterTouristReportByMonth = async (req, res) => {
  const { tourGuideId } = req.params;
  const { year, month } = req.query;

  try {
    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required." });
    }

    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0, 23, 59, 59); // End of the month

    const activities = await Activity.find({
      tourGuideId,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for the given month." });
    }

    const totalTourists = activities.reduce((sum, activity) => sum + activity.totalTourists, 0);

    res.status(200).json({
      totalTourists,
      activities,
      reportPeriod: { year, month },
    });
  } catch (error) {
    console.error("Error filtering tourist report by month:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTourGuideProfile,
  getTourGuide,
  updateTourGuide,
  saveTourGuideIdUrl,
  rateTourGuide,
  getSalesReport,
  filterSalesReport,
  getTouristReport,
  filterTouristReportByMonth,
    
};
