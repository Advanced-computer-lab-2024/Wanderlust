const Booking = require("../Models/Booking");

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
      })

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

module.exports = { fetchBookings };
