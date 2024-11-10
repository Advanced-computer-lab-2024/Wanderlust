import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "./BookingCard";  // Import the BookingCard component

const BookingTourist = () => {
  // Initialize bookings state as an empty array
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get the logged-in tourist's ID (assuming it's stored in localStorage as jwtToken)
        const userId = async () => {
          try {
            const response = await axios.get("http://localhost:8000/api/admin/getLoggedInInfo", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            });
            console.log(response.data);  // Check if we get the user data correctly
            return response.data; // Assuming response.data contains the user ID
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        };
        
        const userIdValue = await userId();

        // Make the API call to fetch bookings for the current tourist
        const response = await axios.get("http://localhost:8000/api/bookings/getBooking", {
          params: {
            userId: userIdValue, // Send the logged-in userId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        console.log(response.data); // Check the actual response

        // Check if the response is an array before updating the state
        if (Array.isArray(response.data)) {
          setBookings(response.data);  // Set bookings if valid array
        } else {
          setBookings([]);  // Set to an empty array if the response is not valid
          setError("Invalid data format received.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("An error occurred while fetching your bookings.");
      }
    };

    fetchBookings();
  }, []);  // Empty dependency array means this effect runs once after initial render

  // Function to handle booking cancellation
  const handleCancelBooking = (bookingId) => {
    // Remove the canceled booking from the state
    setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
  };

  return (
    <div className="booking-tourist">
      <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
        Your Bookings
      </h2>

      {error && <p className="error">{error}</p>}

      {Array.isArray(bookings) && bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        <div>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onCancel={handleCancelBooking} />
            ))
          ) : (
            <p>Loading...</p>  // Optional: Show a loading message if bookings is not yet loaded
          )}
        </div>
      )}
    </div>
  );
};

export default BookingTourist;
