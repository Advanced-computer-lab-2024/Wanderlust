import React from "react";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import BookingActivity from "../../Components/BookingActivity";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QO30DGDvVcCb4JsAoGHQPZ25L3OMnkYdumgaiFqy1u4KBIlZcIKtWgzB8aa8irQKBiXYmft4W6USa0Iv970BdhM00oUWcviEg"
);
const BookingActivityPage = () => {
  const location = useLocation();
  const { activityId, price } = location.state || {}; // Destructure data from state

  if (!activityId || !price) {
    return <p>Invalid booking information. Please try again.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <Elements stripe={stripePromise}>
        <BookingActivity activityId={activityId} price={price} />;
      </Elements>
    </>
  );
};

export default BookingActivityPage;
