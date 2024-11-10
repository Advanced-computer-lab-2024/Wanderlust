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

      <div className="mt-2">
        <h4 className="font-semibold text-sm">Booking Details:</h4>
        {booking.activityId ? (
          <div>
            <p className="text-gray-500 text-xs">Activity: {booking.activityId.name}</p>
            <p className="text-gray-500 text-xs">Date: {new Date(booking.activityId.date).toLocaleDateString()}</p>
            <p className="text-gray-500 text-xs">Price: ${booking.activityId.price}</p>
          </div>
        ) : booking.itineraryId ? (
          <div>
            <p className="text-gray-500 text-xs">Itinerary: {booking.itineraryId.title}</p>
            <p className="text-gray-500 text-xs">Duration: {booking.itineraryId.duration} hours</p>
            <p className="text-gray-500 text-xs">Price: ${booking.itineraryId.price}</p>
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
