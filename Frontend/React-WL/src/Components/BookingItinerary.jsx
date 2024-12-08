import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const BookingItinerary = ({ itineraryId, price }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
   
    setError(null);
    setSuccess(false);

    try {
      switch (paymentMethod) {
        case "wallet":
          await axios.post(
            "http://localhost:8000/api/itinerary/bookItinerary",
            { itineraryId, paymentMethod: "wallet" },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          alert("Payment successful using wallet");
          setSuccess(true);
          break;

        case "card": {
          const { data } = await axios.post(
            "http://localhost:8000/api/itinerary/bookItinerary",
            { itineraryId, paymentMethod: "card" },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            throw new Error("CardElement not found");
          }

          const { paymentIntent, error } = await stripe.confirmCardPayment(
            data.clientSecret,
            {
              payment_method: { card: cardElement },
            }
          );

          if (error) throw new Error(error.message);

          await axios.post(
            "http://localhost:8000/api/itinerary/cardPaymentSuccess",
            { itineraryId, paymentIntentId: paymentIntent.id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          alert("Booking confirmed and actions completed!");
          setSuccess(true);
          break;
        }

        default:
          throw new Error("Please select a valid payment method");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Book Itinerary
        </h1>

        {/* Total Amount Section */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Itinerary Price: <span className="text-green-600">${price}</span>
          </p>
        </div>

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Choose a Payment Method
          </h2>
          <div className="space-y-4">
            <div
              className={`border p-4 rounded-md cursor-pointer ${
                paymentMethod === "card"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <h3 className="font-bold">Card Payment</h3>
            </div>
            <div
              className={`border p-4 rounded-md cursor-pointer ${
                paymentMethod === "wallet"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("wallet")}
            >
              <h3 className="font-bold">Wallet Payment</h3>
            </div>
          </div>
        </div>

        {/* Render CardElement Below Payment Options */}
        {paymentMethod === "card" && (
          <div className="mt-4">
            <CardElement className="border p-2 rounded-md" />
          </div>
        )}

        {/* Confirm Payment Button */}
        <div className="mt-6">
          <button
            className="bg-custom text-white px-2 py-1 rounded-md text-xs"
            onClick={handlePayment}
          
          >
            Confirm Payment
          </button>
          
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-green-500 text-center">
            Payment Confirmed! Thank you for booking.
          </div>
        )}

        {/* Error Message */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default BookingItinerary;
