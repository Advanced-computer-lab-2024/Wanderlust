import React from "react";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import BookingActivity from "../../Components/BookingActivity";
import { useLocation } from "react-router-dom";

const BookingActivityPage = () => {
  const location = useLocation();
  const { activityId, price } = location.state || {}; // Destructure data from state

  if (!activityId || !price) {
    return <p>Invalid booking information. Please try again.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <BookingActivity activityId={activityId} price={price} />;
    </>
  );
};

export default BookingActivityPage;
