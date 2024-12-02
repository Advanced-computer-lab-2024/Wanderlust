const Activity = require("../Models/Activity.js");
const { default: mongoose, get } = require("mongoose");
const { findById } = require("../Models/tourGuide.js");
const ActivityCatModel = require("../Models/ActivityCat.js");
const Booking = require("../Models/Booking.js");
const User = require("../Models/user");
const { convertCurrency } = require("./currencyConverter");
const touristModel = require("../Models/Tourist");

const createActivity = async (req, res) => {
  const {
    name,
    date,
    time,
    lat,
    lng,
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
      lat,
      lng,
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
  const { touristId } = req.query; 
  try {
    const activities = await Activity.find()
      .populate("category")
      .populate("tags");
    let currency = 'EGP'; 
    if (touristId) {
      const tourist = await touristModel.findById(touristId);
      if (tourist && tourist.currency) {
        currency = tourist.currency; // Use tourist's preferred currency
      }
    }
    const convertedActivities = await Promise.all(
      activities.map(async (item) => {
        const convertedItem = item.toObject();
        convertedItem.price = await convertCurrency(
          convertedItem.price,
          currency,
        );
        return convertedItem;
      })
    );
    return res.status(200).json(convertedActivities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivityGuest = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("category")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const id = req.query.id;
    const activity = await Activity.findById(id)
      .populate("category")
      .populate("tags");
    if (!activity) {
      res.status(404).json({ error: "Activity not found" });
    } else {
      res.status(200).json(activity);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  const {
    id,
    date,
    time,
    lat,
    lng,
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
        lat,
        lng,
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
// http://localhost:8000/api/activity/filterActivities
const filterActivities = async (req, res) => {
  try {
    const { minBudget, maxBudget, date, category, ratings } = req.query;

    const query = {};
    if (minBudget !== undefined && maxBudget !== undefined) {
      query.price = { $gte: minBudget, $lte: maxBudget };
    }
    if (date !== undefined) {
      query.date = new Date(date);
    }
    if (category !== undefined) {
      const cat = await ActivityCatModel.findOne({ name: category });
      query.category = cat._id;
    }
    if (ratings !== undefined) {
      query.rating = ratings;
    }

    const activities = await Activity.find(query)
      .populate("category")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sortActivities = async (req, res) => {
  try {
    const { sortBy = "price", orderBy = "1" } = req.query; // Set default values
    const sortQuery = { [sortBy]: parseInt(orderBy) }; // Ensure orderBy is an integer
    const activities = await Activity.find()
      .sort(sortQuery)
      .populate("category")
      .populate("tags");
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for Activity by name or tags
const searchActivity = async (req, res) => {
  const { query } = req.query;
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
        activity.tags.some((tags) =>
          tags.name.toLowerCase().includes(query.toLowerCase())
        );
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

//point 43 choose category of aactivities
const getActivitiesByCategoryName = async (req, res) => {
  const { query } = req.query;
  try {
    const activities = await Activity.find()
      .populate("tags")
      .populate("category");

    const filteredActivities = activities.filter((activity) => {
      const nameMatches = activity.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const tagMatches =
        activity.tags &&
        activity.tags.some((tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase())
        );
      const categoryMatches =
        activity.category &&
        activity.category.name.toLowerCase().includes(query.toLowerCase());
      return nameMatches || tagMatches || categoryMatches;
    });

    res.status(200).json(filteredActivities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Generate a shareable link for an activity
const generateShareableLink = async (req, res) => {
  const { activityId } = req.params;
  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    const shareableLink = `http://localhost:8000/api/activity/${activityId}`;
    res.status(200).json({ shareableLink });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Send activity link via email
const sendActivityLinkViaEmail = async (req, res) => {
  const { activityId } = req.params;
  const { email } = req.body;
  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    const shareableLink = `http://localhost:8000/api/activity/${activityId}`;
    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Check out this activity!",
      text: `Here is a link to the activity: ${shareableLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ message: "Email sent successfully", info });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//6712cf83465daa3af226a8d4 tourist id for testing
//6702fbfc96b940f8259bba39 activity id for testing

const rateActivity = async (req, res) => {
  const { activityId } = req.params;
  const { userId, rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: user._id,
      rating,
      comment,
    };
    activity.comments.push(newComment);
    // Update the average rating
    const totalRatings = activity.comments.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    activity.rating = totalRatings / activity.comments.length;

    await activity.save();

    res
      .status(200)
      .json({ message: "Rating and comment added successfully", activity });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const bookActivity = async (req, res) => {
  try {
    const { activityId, userId } = req.body;

    if (!activityId || !userId) {
      return res
        .status(400)
        .json({ message: "Activity ID and User ID required" });
    }
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const booking = await Booking.findOne({ activityId, userId });
    if (booking) {
      return res
        .status(400)
        .json({ message: "User has already booked this activity" });
    }
    // Create a new booking
    const newBooking = new Booking({
      activityId,
      userId,
    });

    await newBooking.save(); // Save to the database

    res
      .status(201)
      .json({ message: "Booking successful!", userId, activityId });
  } catch (error) {
    console.error("Error booking itinerary:", error);
    res.status(500).json({ message: error.message });
  }
};
const cancelActivityBooking = async (req, res) => {
  const { bookingId } = req.params; // Get the booking ID from the request params

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.activityId == null) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const activity = await Activity.findById(booking.activityId);
    const activityTime = new Date(`${activity.date}T${activity.time}`);
    // Check if the event start time is more than 48 hours away
    const currentTime = new Date();

    const eventTime = new Date(activityTime); // Assume you have an eventStartTime field

    const timeDifference = eventTime - currentTime; // in milliseconds
    const hoursDifference = timeDifference / (1000 * 60 * 60); // convert to hours

    if (hoursDifference < 48) {
      return res.status(400).json({
        message: `Cannot cancel booking less than 48 hours before the event, hoursDifference=${hoursDifference}`,
      });
    }

    // If it's more than 48 hours, proceed to cancel the booking
    await Booking.deleteOne({ _id: bookingId });
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//bookmarking activities
const saveActivity = async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!tourist.savedActivities.includes(activityId)) {
      tourist.savedActivities.push(activityId);
      await tourist.save();
    }

    return res.status(200).json({ message: "Activity saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error saving activity", error: error.message });
  }
};

const unsaveActivity = async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    tourist.savedActivities = tourist.savedActivities.filter(id => id.toString() !== activityId);
    await tourist.save();

    return res.status(200).json({ message: "Activity unsaved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error unsaving activity", error: error.message });
  }
};

const getSavedActivities = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId).populate({
      path: 'savedActivities',
      populate: { path: 'category tags' }
    });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json(tourist.savedActivities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving saved activities", error: error.message });
  }
};

const requestNotification = async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (!tourist.notificationRequests.includes(activityId)) {
      tourist.notificationRequests.push(activityId);
      await tourist.save();
    }

    return res.status(200).json({ message: "Notification request saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error saving notification request", error: error.message });
  }
};

module.exports = {
  createActivity,
  getActivity,
  getActivityGuest,
  getActivityById,
  updateActivity,
  deleteActivity,
  filterActivities,
  sortActivities,
  searchActivity,
  getActivitiesByCategoryName,
  generateShareableLink,
  sendActivityLinkViaEmail,
  rateActivity,
  bookActivity,
  cancelActivityBooking,
  saveActivity,
  unsaveActivity,
  getSavedActivities,
  requestNotification
};
