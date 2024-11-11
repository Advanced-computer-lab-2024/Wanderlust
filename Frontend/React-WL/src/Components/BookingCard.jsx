import React from "react";
import axios from "axios";

const BookingCard = ({ booking, onCancel }) => {
  // Function to display the booking name (either activity or itinerary)
  const getBookingName = () => {
    if (booking.activityId) {
      return booking.activityId.name;
    } else if (booking.itineraryId) {
      return booking.itineraryId.title;
    } else {
      return "No Name Available";
    }
  };

  const handleReviewTourGuide = async () => {
    const tourGuideRating = document.querySelector('input[placeholder="Rate the tourguide (1-5)"]').value;
    const tourGuideComment = document.querySelector('textarea[placeholder="Comment on the tourguide"]').value;
    // console.log(tourGuideRating, tourGuideComment);
    // console.log(booking.itineraryId.creator._id);
    const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    });
    const user = response.data;
    try {
      await axios.post(
        `http://localhost:8000/api/tourGuide/rate/${booking.itineraryId.creator._id}`,
        {
          userId: user._id,
          rating: tourGuideRating,
          comment: tourGuideComment,
        },
      );
      alert("Tour guide review submitted successfully!");
    } catch (error) {
      console.error("Error submitting tour guide review:", error);
      alert("Failed to submit tour guide review. Please try again later.");
    }
  };
  const handleReviewItinerary = async () => {
    const itineraryRating = document.querySelector('input[placeholder="Rate the itinerary (1-5)"]').value;
    const itineraryComment = document.querySelector('textarea[placeholder="Comment on the itinerary"]').value;
    // console.log(itineraryRating, itineraryComment);
    // console.log(booking.itineraryId._id);
    try {
      await axios.post(
        `http://localhost:8000/api/itinerary/itinerary/rate`,
        {
          itineraryId: booking.itineraryId._id,
          rating: itineraryRating,
          review: itineraryComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      }
      );
      alert("Itinerary review submitted successfully!");
    } catch (error) {
      console.error("Error submitting itinerary review:", error);
      alert("Failed to submit itinerary review. Please try again later.");
    }
  };

  const handleReviewActivity = async () => {
    const activityRating = document.querySelector('input[placeholder="Rate the activity (1-5)"]').value;
    const activityComment = document.querySelector('textarea[placeholder="Comment on the activity"]').value;
    // console.log(activityRating, activityComment);
    // console.log(booking.activityId._id);
    const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
      headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    });
    const user = response.data;
    try {
      await axios.post(
        `http://localhost:8000/api/activity/rate/${booking.activityId._id}`,
        {
          userId: user._id,
          rating: activityRating,
          comment: activityComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        }
      }
      );
      alert("Activity review submitted successfully!");
    } catch (error) {
      console.error("Error submitting activity review:", error);
      alert("Failed to submit activity review. Please try again later.");
    }
  };

  // Function to format the booking's created date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Function to get the booking price (from activity or itinerary)
  const getBookingPrice = () => {
    if (booking.activityId) {
      return booking.activityId.price;
    } else if (booking.itineraryId) {
      return booking.itineraryId.price;
    } else {
      return "N/A";
    }
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async () => {
    try {
      // Determine whether it's an activity or itinerary booking
      const bookingType = booking.activityId ? "activity" : booking.itineraryId ? "itinerary" : null;

      // Check the booking type and call the appropriate API route
      if (bookingType === "activity") {
        await axios.delete(`http://localhost:8000/api/activity/cancelActivityBooking/${booking._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
      } else if (bookingType === "itinerary") {
        await axios.delete(`http://localhost:8000/api/itinerary/cancelItineraryBooking/${booking._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
      }

      // Call the onCancel function to refresh bookings after cancellation
      onCancel(booking._id);
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again later.");
    }
  };


  // Render booking card
  return (
    <div className="bg-white rounded-xl shadow-md relative p-4 mb-4">
      <h3 className="text-lg font-bold">{getBookingName()}</h3>
      <p className="text-gray-600 text-sm">Booking Date: {formatDate(booking.createdAt)}</p>
      <p className="text-gray-600 text-sm">Price: ${getBookingPrice()}</p>
      <p className="text-gray-600 text-sm">Attended: {booking.attended ? "True" : "False"} </p>

      <div className="mt-2"></div>
      <div className="mt-</div>2">
        <h4 className="font-semibold text-sm">Booking Details:</h4>
        {booking.activityId ? (
          <div>
            <p className="text-gray-500 text-xs">Activity: {booking.activityId.name}</p>
            <p className="text-gray-500 text-xs">Date: {new Date(booking.activityId.date).toLocaleDateString()}</p>
            <p className="text-gray-500 text-xs">Price: ${booking.activityId.price}</p>
            {booking.attended && (
              <div className="mt-2">
              <h4 className="font-semibold text-sm">Add a Comment and Rating:</h4>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Activity Rating:</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="border rounded p-1 text-xs w-full"
                  placeholder="Rate the activity (1-5)"
                />
              </div>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Activity Comment:</label>
                <textarea
                  className="border rounded p-1 text-xs w-full"
                  placeholder="Comment on the activity"
                ></textarea>
              </div>
              <div className="mt-1">
                <button onClick={handleReviewActivity} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit Review
                </button>
              </div>
              </div>
            )}


          </div>
        ) : booking.itineraryId ? (
          <div>
            <p className="text-gray-500 text-xs">Itinerary: {booking.itineraryId.title}</p>
            <p className="text-gray-500 text-xs">Duration: {booking.itineraryId.duration} hours</p>
            <p className="text-gray-500 text-xs">Price: ${booking.itineraryId.price}</p>
            <p className="text-gray-600 text-sm">Tourguide: {booking.itineraryId.creator.userId.username} </p>
            {booking.attended && (
              <div className="mt-2">
              <h4 className="font-semibold text-sm">Add a Comment and Rating:</h4>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Tourguide Rating:</label>
                <input
                type="number"
                min="1"
                max="5"
                className="border rounded p-1 text-xs w-full"
                placeholder="Rate the tourguide (1-5)"
                />
              </div>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Tourguide Comment:</label>
                <textarea
                className="border rounded p-1 text-xs w-full"
                placeholder="Comment on the tourguide"
                ></textarea>
              </div>
              <div className="mt-1">
                <button onClick={handleReviewTourGuide} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit Review
                </button>
              </div>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Itinerary Rating:</label>
                <input
                type="number"
                min="1"
                max="5"
                className="border rounded p-1 text-xs w-full"
                placeholder="Rate the itinerary (1-5)"
                />
              </div>
              <div className="mt-1">
                <label className="block text-gray-500 text-xs">Itinerary Comment:</label>
                <textarea
                className="border rounded p-1 text-xs w-full"
                placeholder="Comment on the itinerary"
                ></textarea>
              </div>
              <div className="mt-1">
                <button onClick={handleReviewItinerary} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit Review
                </button>
              </div>
              </div>
            )}

          </div>
        ) : null}
      </div>

      {/* Cancel Booking Button */}
      <button
        onClick={handleCancelBooking}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancel Booking
      </button>
    </div>
  );
};

export default BookingCard;
