import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "./BookingCard"; // Ensure the path is correct
import { FaSpinner } from "react-icons/fa"; // For loading spinner

const BookingTourist = () => {
  // State variables for upcoming and past bookings
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  // State variables for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State variable for active tab ('upcoming' or 'past')
  const [activeTab, setActiveTab] = useState("upcoming");

  // State variable for confirmation dialog
  const [confirmCancel, setConfirmCancel] = useState({
    isOpen: false,
    bookingId: null,
  });

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        // Fetch user info to get userId
        const userResponse = await axios.get(
          "http://localhost:8000/api/admin/getLoggedInInfo",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        const userId = userResponse.data._id;

        // Fetch upcoming bookings
        const upcomingResponse = await axios.get(
          "http://localhost:8000/api/bookings/getUpcomingBooking",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        // Fetch past bookings
        const pastResponse = await axios.get(
          "http://localhost:8000/api/bookings/getPastBooking",
          {
            params: { userId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        // Validate and set upcoming bookings
        if (Array.isArray(upcomingResponse.data)) {
          setUpcomingBookings(upcomingResponse.data);
        } else {
          setUpcomingBookings([]);
          setError("Invalid data format received for upcoming bookings.");
        }

        // Validate and set past bookings
        if (Array.isArray(pastResponse.data)) {
          setPastBookings(pastResponse.data);
        } else {
          setPastBookings([]);
          setError("Invalid data format received for past bookings.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("An error occurred while fetching your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []); // Runs once on component mount

  // Function to handle booking cancellation with confirmation
  const handleCancelBooking = async (bookingId) => {
    try {
      // Determine booking type based on its presence in upcoming or past bookings
      const isUpcoming = upcomingBookings.some(
        (booking) => booking._id === bookingId
      );

      const bookingType = isUpcoming ? "activity" : "itinerary";

      // Determine the appropriate API endpoint
      const cancelEndpoint =
        bookingType === "activity"
          ? `http://localhost:8000/api/activity/cancelActivityBooking/${bookingId}`
          : `http://localhost:8000/api/itinerary/cancelItineraryBooking/${bookingId}`;

      const response = await axios.delete(cancelEndpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.status === 200) {
        alert("Booking canceled successfully!");

        // Remove the canceled booking from the state
        if (isUpcoming) {
          setUpcomingBookings((prev) =>
            prev.filter((booking) => booking._id !== bookingId)
          );
        } else {
          setPastBookings((prev) =>
            prev.filter((booking) => booking._id !== bookingId)
          );
        }
      } else {
        alert("Failed to cancel booking. Please try again.");
      }
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("An error occurred while canceling the booking.");
    }
  };

  // Function to open confirmation dialog
  const openConfirmCancel = (bookingId) => {
    setConfirmCancel({ isOpen: true, bookingId });
  };

  // Function to close confirmation dialog
  const closeConfirmCancel = () => {
    setConfirmCancel({ isOpen: false, bookingId: null });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Your Bookings</h2>
        <p className="text-gray-600">Manage your upcoming and past bookings.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "past"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Past Bookings
          </button>
        </nav>
      </div>

      {/* Booking Lists */}
      <div>
        {activeTab === "upcoming" && (
          <div>
            {upcomingBookings.length === 0 ? (
              <p className="text-center text-gray-500">You have no upcoming bookings.</p>
            ) : (
              upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={openConfirmCancel}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div>
            {pastBookings.length === 0 ? (
              <p className="text-center text-gray-500">You have no past bookings.</p>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={openConfirmCancel}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmCancel.isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          aria-modal="true"
          role="dialog"
          aria-labelledby="confirm-cancel-title"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
            <h3 id="confirm-cancel-title" className="text-xl font-semibold text-red-600 mb-4">
              Confirm Cancellation
            </h3>
            <p className="mb-6">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              >
                No, Keep Booking
              </button>
              <button
                onClick={() => {
                  handleCancelBooking(confirmCancel.bookingId);
                  closeConfirmCancel();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none transition-colors duration-200"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTourist;
