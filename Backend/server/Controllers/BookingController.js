const Booking = require("../Models/Booking");
const jwt = require("jsonwebtoken");
const Tourist = require("../Models/Tourist");
const fetchBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch all bookings based on the userId (if provided)
    let bookings = await Booking.find({ userId })
      .populate("activityId") // Populate related activity data (if present)
      .populate("userId", "username email") // Populate user data (e.g., name and email)
      .populate({
        path: "itineraryId",
        populate: {
          path: "creator",
          populate: {
            path: "userId",
            select: "username email"
          }
        }
      });

    // Iterate and update the `attended` status based on the current time
    const currentTime = new Date();
    const updates = [];

    for (const booking of bookings) {
      const { activityId, itineraryId, attended } = booking;

      // Check the start time of activity or itinerary
      const activityStartTime = activityId
        ? new Date(`${activityId.date}T${activityId.time}`)
        : null;
      const itineraryStartTime = itineraryId?.timeline?.start;

      if (
        !attended && // Update only if not already attended
        ((activityStartTime && currentTime >= activityStartTime) ||
          (itineraryStartTime && currentTime >= itineraryStartTime))
      ) {
        updates.push({
          updateOne: {
            filter: { _id: booking._id },
            update: { attended: true },
          },
        });
      }
    }
    if (updates.length > 0) {
      await Booking.bulkWrite(updates);
      // Re-fetch the updated bookings
      bookings = await Booking.find({ userId })
        .populate("activityId")
        .populate("userId", "username email")
        .populate("itineraryId")
        .exec();
    }

    // Return the valid bookings
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

const fetchUpcomingBookings = async (req, res) => {
  console.log("FetchUpcomingBookings");
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const touristId = decoded.id;
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    return res.status(404).json({ message: "Tourist not found" });
  }

  try {
    let bookings = await Booking.find({ userId: tourist.userId })
      .populate("activityId") // Populate related activity data (if present)
      .populate("userId", "username email") // Populate user data (e.g., name and email)
      .populate({
        path: "itineraryId",
        populate: {
          path: "creator",
          populate: {
            path: "userId",
            select: "username email"
          }
        }
      })
      .exec();

    const currentTime = new Date();
    let upcomingBookings = bookings.filter((booking) => {
      const { activityId, itineraryId } = booking;
      if(activityId){
        const activityStartTime = activityId.date;
        return currentTime < activityStartTime;
      }
       else if(itineraryId){
        const itineraryStartTime = itineraryId.timeline.start;
        return currentTime < itineraryStartTime;
      }

    });

    res.status(200).json(upcomingBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

const fetchPastBookings = async (req, res) => {
  console.log("FetchUpcomingBookings");
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  const token = authHeader.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const touristId = decoded.id;
  const tourist = await Tourist.findById(touristId);
  if (!tourist) {
    return res.status(404).json({ message: "Tourist not found" });
  }

  try {
    let bookings = await Booking.find({ userId: tourist.userId })
      .populate("activityId") // Populate related activity data (if present)
      .populate("userId", "username email") // Populate user data (e.g., name and email)
      .populate({
        path: "itineraryId",
        populate: {
          path: "creator",
          populate: {
            path: "userId",
            select: "username email"
          }
        }
      })
      .exec();

    const currentTime = new Date();
    let upcomingBookings = bookings.filter((booking) => {
      const { activityId, itineraryId } = booking;
      if(activityId){
        const activityStartTime = activityId.date;
        return currentTime > activityStartTime;
      }
       else if(itineraryId){
        const itineraryStartTime = itineraryId.timeline.start;
        return currentTime > itineraryStartTime;
      }

    });

    res.status(200).json(upcomingBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchBookings, fetchUpcomingBookings , fetchPastBookings};
