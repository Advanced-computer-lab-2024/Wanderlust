import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaTimes } from "react-icons/fa";

// Reusable StarRating Component
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <FaStar
              className={`h-6 w-6 ${
                starValue <= (hoverRating || rating)
                  ? "text-yellow-400" // Updated to a yellow shade
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  // State for transportation booking
  const [selectedTransportation, setSelectedTransportation] = useState("uber");

  // States for review modals
  const [showActivityReview, setShowActivityReview] = useState(false);
  const [showTourGuideReview, setShowTourGuideReview] = useState(false);
  const [showItineraryReview, setShowItineraryReview] = useState(false);

  // States for review inputs
  const [activityRating, setActivityRating] = useState(0);
  const [activityComment, setActivityComment] = useState("");

  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState("");

  const [itineraryRating, setItineraryRating] = useState(0);
  const [itineraryComment, setItineraryComment] = useState("");

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
      const bookingType = booking.activityId
        ? "activity"
        : booking.itineraryId
        ? "itinerary"
        : null;

      if (!bookingType) {
        alert("Invalid booking type.");
        return;
      }

      const cancelEndpoint =
        bookingType === "activity"
          ? `http://localhost:8000/api/activity/cancelActivityBooking/${booking._id}`
          : `http://localhost:8000/api/itinerary/cancelItineraryBooking/${booking._id}`;

      const response = await axios.delete(cancelEndpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.status === 200) {
        alert("Booking canceled successfully!");
        onCancel(booking._id);
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("An error occurred while canceling the booking.");
    }
  };

  // Function to handle transportation booking
  const handleBookTransportation = async () => {
    try {
      const responseUser = await axios.get(
        "http://localhost:8000/api/admin/getLoggedInUser",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      const user = responseUser.data;

      const advertiserId =
        selectedTransportation === "uber"
          ? "67324784d7b329c5a5120909"
          : "67324738d7b329c5a5120903";

      const response = await axios.post(
        "http://localhost:8000/api/transportation/bookTransportation",
        {
          advertiserId,
          touristId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Transportation booked successfully!");
      } else {
        alert("Failed to book transportation. Please try again.");
      }
    } catch (error) {
      console.error("Error booking transportation:", error);
      alert("An error occurred while booking transportation.");
    }
  };

  // Function to handle review submissions
  const handleSubmitReview = async (type, rating, comment, id) => {
    if (rating < 1 || rating > 5) {
      alert(`Please enter a valid rating between 1 and 5 for the ${type}.`);
      return;
    }

    try {
      const responseUser = await axios.get(
        "http://localhost:8000/api/admin/getLoggedInUser",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      const user = responseUser.data;

      let response;
      if (type === "activity") {
        response = await axios.post(
          `http://localhost:8000/api/activity/rate/${id}`,
          {
            userId: user._id,
            rating,
            comment,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
      } else if (type === "tour-guide") {
        response = await axios.post(
          `http://localhost:8000/api/tourGuide/rate/${id}`,
          {
            userId: user._id,
            rating,
            comment,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
      } else if (type === "itinerary") {
        response = await axios.post(
          `http://localhost:8000/api/itinerary/itinerary/rate`,
          {
            itineraryId: id,
            rating,
            review: comment,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
      }

      if (response.status === 200) {
        alert(`${type} review submitted successfully!`);
        setActivityRating(0);
        setActivityComment("");
        setTourGuideRating(0);
        setTourGuideComment("");
        setItineraryRating(0);
        setItineraryComment("");
      } else {
        alert(`Failed to submit ${type} review. Please try again.`);
      }
    } catch (error) {
      console.error(`Error submitting ${type} review:`, error);
      alert(`An error occurred while submitting the ${type} review.`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Booking Header */}
      <h3 className="text-lg font-bold text-blue-900">{getBookingName()}</h3>
      <p className="text-gray-600 text-sm">
        Booking Date: {formatDate(booking.createdAt)}
      </p>
      <p className="text-gray-600 text-sm">Price: ${getBookingPrice()}</p>
      <p className="text-gray-600 text-sm">
        Attended: {booking.attended ? "Yes" : "No"}
      </p>

      {/* Transportation Booking */}
      {!booking.attended && (
        <>
          <div className="mt-4">
            <label className="block text-gray-500 text-xs">
              Select Transportation:
            </label>
            <select
              className="border rounded p-2 text-xs w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTransportation}
              onChange={(e) => setSelectedTransportation(e.target.value)}
              aria-label="Select Transportation"
            >
              <option value="uber">Uber</option>
              <option value="london-cab">London Cab</option>
            </select>
          </div>
          <div className="mt-2">
            <button
              onClick={handleBookTransportation}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none transition-colors duration-200 text-xs flex items-center"
              aria-label="Book Transportation"
            >
              Book Transportation
            </button>
          </div>
        </>
      )}

      {/* Review Modals */}
      <div className="mt-4">
        {/* Activity Review */}
        <div className="flex items-center mt-2">
          <button
            onClick={() => setShowActivityReview(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none transition-colors duration-200 text-xs flex items-center"
            aria-label="Review Activity"
          >
            Review Activity
          </button>
          {showActivityReview && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl w-80">
                <h3 className="text-xl text-center text-blue-900 mb-4">
                  Review Activity
                </h3>
                <StarRating
                  rating={activityRating}
                  setRating={setActivityRating}
                />
                <textarea
                  value={activityComment}
                  onChange={(e) => setActivityComment(e.target.value)}
                  placeholder="Write your review"
                  rows={4}
                  className="w-full border rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() =>
                      handleSubmitReview("activity", activityRating, activityComment, booking.activityId._id)
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none text-xs"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowActivityReview(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none text-xs"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Reviews (Tour Guide, Itinerary) can be added in a similar manner */}
      </div>

      {/* Cancel Booking Button */}
      {!booking.attended && (
        <button
          onClick={handleCancelBooking}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none text-xs mt-4"
        >
          Cancel Booking
        </button>
      )}
    </div>
  );
};

export default BookingCard;
