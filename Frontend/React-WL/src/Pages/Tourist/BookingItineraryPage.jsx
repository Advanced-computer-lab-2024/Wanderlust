import React, { useEffect } from "react";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import BookingItinerary from "../../Components/BookingItinerary";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QO30DGDvVcCb4JsAoGHQPZ25L3OMnkYdumgaiFqy1u4KBIlZcIKtWgzB8aa8irQKBiXYmft4W6USa0Iv970BdhM00oUWcviEg"
);

const BookingItineraryPage = () => {
  const location = useLocation();
  const { itineraryId, price } = location.state || {}; // Destructure data from state

  useEffect(() => {
    console.log("BookingItineraryPage rendered");
    console.log("Location state:", location.state);
    console.log("Itinerary ID:", itineraryId);
    console.log("Price:", price);
  }, [location]);

  if (!itineraryId || !price) {
    return <p>Invalid booking information. Please try again.</p>;
  }

  return (
    <>
      <TouristNavBar />
      <Elements stripe={stripePromise}>
        <BookingItinerary itineraryId={itineraryId} price={price} />
      </Elements>
    </>
  );
};

export default BookingItineraryPage;
