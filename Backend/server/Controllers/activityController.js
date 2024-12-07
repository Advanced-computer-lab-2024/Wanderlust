const Activity = require("../Models/Activity.js");
const { default: mongoose, get } = require("mongoose");
const { findById } = require("../Models/tourGuide.js");
const ActivityCatModel = require("../Models/ActivityCat.js");
const Booking = require("../Models/Booking.js");
const User = require("../Models/user");
const { convertCurrency } = require("./currencyConverter");
const touristModel = require("../Models/Tourist");
const { updatePointsOnPayment, updateBadge } = require("./touristController");
const { sendReceipt } = require("./NotificationController");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key
const jwt = require("jsonwebtoken");

const createActivity = async (req, res) => {
  const {
    name,
    date,
    time,
    lat,
    lng,
    price,
    duration,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
    picture,
    description,
  } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const advertiserId = decodedToken.id;

    const activity = await Activity.create({
      name,
      date,
      time,
      lat,
      lng,
      price,
      duration,
      category,
      tags,
      specialDiscounts,
      bookingOpen,
      advertiserId, // Automatically include advertiserId
      picture,
      description,
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
    let currency = "EGP";
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
          currency
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
    picture,
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
        description,
        picture,
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
    const shareableLink = `http://localhost:8000/api/activity/getActivityById?id=${activityId}`;
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
    const shareableLink = `http://localhost:8000/api/activity/getActivityById?id=${activityId}`;
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
    const { activityId, paymentMethod } = req.body;
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const oldbooking = await Booking.findOne({
      userId: tourist.userId,
      activityId,
    });
    if (oldbooking) {
      return res
        .status(400)
        .json({ message: "User has already booked this activity" });
    }

    if (paymentMethod === "wallet") {
      // Wallet payment
      if (tourist.wallet < activity.price) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Deduct from wallet and update booking
      tourist.wallet -= activity.price;
      await tourist.save();

      console.log("Payment successful using wallet");
      await postPaymentSuccess(activityId, tourist._id);
      if (!postPaymentSuccess.success) {
        console.log(
          "Post-payment processing failed",
          postPaymentSuccess.message
        );
      } else {
        console.log("Post-payment processing successful");
      }
      return res.json({ message: "Payment successful using wallet" });
    } else if (paymentMethod === "card") {
      // Stripe payment
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: activity.price * 100, // Convert to cents
          currency: tourist.currency,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });
        console.log("Payment processing successful");

        return res.json({
          clientSecret: paymentIntent.client_secret,
          message: "Payment processing successful",
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Payment processing failed", error: error.message });
      }
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error booking activity:", error);
    return res.status(500).json({ message: error.message });
  }
};
const postPaymentSuccess = async (activityId, touristId) => {
  try {
    const tourist = await touristModel.findOne({ _id: touristId });

    if (!tourist) {
      return { success: false, message: "Tourist not found" };
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return { success: false, message: "Activity not found" };
    }

    // Perform post-payment actions
    const booking = new Booking({
      userId: tourist.userId,
      activityId: activityId,
    });
    await booking.save();
    // Update points on payment
    await updatePointsOnPayment(tourist._id, activity.price);

    // Update badge
    updateBadge(tourist);
    await tourist.save();
    // Send confirmation email
    await sendReceipt(
      tourist.email,
      tourist.name,
      activity.name,
      activity.price
    );

    return { success: true, message: "Post-payment actions completed" };
  } catch (error) {
    console.error("Error handling payment success:", error);
    return { success: false, message: error.message };
  }
};

const cardPaymentSuccess = async (req, res) => {
  try {
    const { activityId, paymentIntentId } = req.body;

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tourist = await touristModel.findOne({ _id: decoded.id });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    // Validate the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Perform post-payment actions
    await postPaymentSuccess(activityId, tourist._id);
    if (!postPaymentSuccess.success) {
      console.log("Post-payment processing failed", postPaymentSuccess.message);
    } else {
      console.log("Post-payment processing successful");
    }
    return res.status(200).json({ message: "Payment successful using card" });
  } catch (error) {
    console.error("Error handling payment success:", error);
    return res.status(500).json({ message: error.message });
  }
};

const cancelActivityBooking = async (req, res) => {
  const { bookingId } = req.params; // Get the booking ID from the request params

  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
    const tourist = await touristModel.findOne({ _id: decoded.id });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    tourist.wallet += activity.price;
    await tourist.save();

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
    return res
      .status(500)
      .json({ message: "Error saving activity", error: error.message });
  }
};

const unsaveActivity = async (req, res) => {
  const { touristId, activityId } = req.body;

  try {
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    tourist.savedActivities = tourist.savedActivities.filter(
      (id) => id.toString() !== activityId
    );
    await tourist.save();

    return res.status(200).json({ message: "Activity unsaved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error unsaving activity", error: error.message });
  }
};

const getSavedActivities = async (req, res) => {
  const { touristId } = req.params;

  try {
    const tourist = await touristModel.findById(touristId).populate({
      path: "savedActivities",
      populate: { path: "category tags" },
    });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    return res.status(200).json(tourist.savedActivities);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error retrieving saved activities",
      error: error.message,
    });
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

    return res
      .status(200)
      .json({ message: "Notification request saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error saving notification request",
      error: error.message,
    });
  }
};

// flag an activity as inappropriate (admin onlyFlag)
const flagActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.flagged = true;
    await activity.save();
    res
      .status(200)
      .json({ message: "Activity flagged successfully", activity });
  } catch (error) {
    console.error("Error flagging activity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//unflag an activity as inappropriate (admin only)
const unflagActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.flagged = false;
    await activity.save();
    res
      .status(200)
      .json({ message: "Activity unflagged successfully", activity });
  } catch (error) {
    console.error("Error unflagging activity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
  cardPaymentSuccess,
  cancelActivityBooking,
  saveActivity,
  unsaveActivity,
  getSavedActivities,
  requestNotification,
  flagActivity,
  unflagActivity,
};
