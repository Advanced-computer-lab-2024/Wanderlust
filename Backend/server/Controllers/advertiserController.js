const Advertiser = require("../Models/Advertiser.js");
const Activity = require("../Models/Activity.js");
const User = require("../Models/user");
const jwt = require('jsonwebtoken');

//http://localhost:8000/api/advertiser/createAdvertiserProfile/userId
const createAdvertiser = async (req, res) => {
  const { userId } = req.params;
  const { website, companyProfile, hotline } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const advertiser = new Advertiser({
      userId: user._id,
      website,
      companyProfile,
      hotline,
    });
    user.role = "advertiser";
    user.roleApplicationStatus = "pending";
    await advertiser.save();
    await user.save();
    res.status(200).json({
      user,
      advertiser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getAdvertiser = async (req, res) => {
  try {
    const advertisers = await Advertiser.find();
    res.status(200).json(advertisers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAdvertiserByUsername = async (req, res) => {
  const { username } = req.body;

  try {
    const advertiser = await Advertiser.findOne({ username });
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }
    res.status(200).json(advertiser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAdvertiser = async (req, res) => {
  const { username } = req.body;
  const { mobileNumber,companyWebsite, companyProfile, hotline } = req.body;

  console.log("Updating advertiser:", {
    username,
    companyWebsite,
    companyProfile,
    hotline,
  });

  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    var advertiser = await Advertiser.findById(decoded.id);
    const user = await User.findById(advertiser.userId);
    console.log(user);
    console.log(advertiser);
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }
    user.mobileNumber = mobileNumber;
    await user.save();
    advertiser.hotline = hotline;
    advertiser.companyWebsite = companyWebsite;
    advertiser.companyProfile = companyProfile;
    await advertiser.save();
    res.status(200).json({advertiser , user});
    
  } catch (error) {
    console.error("Error updating advertiser:", error);
    res.status(400).json({ error: error.message });
  }
};

const getSalesReport = async (req, res) => {
  const { advertiserId } = req.params;
  try {
    const activities = await Activity.find({ advertiserId });
    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for this advertiser." });
    }

    // Calculate total revenue
    const totalRevenue = activities.reduce((sum, activity) => sum + activity.revenue, 0);

    res.status(200).json({ totalRevenue, activities });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(400).json({ error: error.message });
  }
};

const filterSalesReport = async (req, res) => {
  const { advertiserId } = req.params;
  const { activityName, itinerary, startDate, endDate } = req.query;

  try {
    let query = { advertiserId };

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

    // Calculate filtered revenue
    const totalRevenue = activities.reduce((sum, activity) => sum + activity.revenue, 0);

    res.status(200).json({ totalRevenue, activities });
  } catch (error) {
    console.error("Error filtering sales report:", error);
    res.status(400).json({ error: error.message });
  }
};

const getTouristReport = async (req, res) => {
  const { advertiserId } = req.params;

  try {
    const activities = await Activity.find({ advertiserId });
    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for this advertiser." });
    }

    // Calculate total tourists
    const totalTourists = activities.reduce((sum, activity) => sum + activity.totalTourists, 0);

    res.status(200).json({ totalTourists, activities });
  } catch (error) {
    console.error("Error fetching tourist report:", error);
    res.status(400).json({ error: error.message });
  }
};

const filterTouristReportByMonth = async (req, res) => {
  const { advertiserId } = req.params;
  const { year, month } = req.query; // Expecting year and month as query parameters

  try {
    // Validate inputs
    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required." });
    }

    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0, 23, 59, 59); // End of the month

    const activities = await Activity.find({
      advertiserId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    if (!activities.length) {
      return res.status(404).json({ message: "No activities found for the given month." });
    }

    // Calculate total tourists for the specified month
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
  createAdvertiser,
  getAdvertiser,
  getAdvertiserByUsername,
  updateAdvertiser,
  getSalesReport,
  filterSalesReport,
  getTouristReport

};

// const deleteAdvertiser = async (req, res) => {
//   const { username } = req.params;

//   try {
//       await Advertiser.findOneAndDelete(username);
//       res.status(200).json({ message: 'Advertiser deleted successfully' });
//   } catch (error) {
//       res.status(400).json({ error: error.message });
//   }
// };
