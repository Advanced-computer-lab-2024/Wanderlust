import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import ErrorPopupComponent from "./ErrorPopupComponent";
import { useNavigate } from "react-router-dom";

const fetchPromoCodeId = async (input) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/tourist/getPromoCodeId",
      { code: input },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data.promoCodeId;
  } catch (err) {
    console.error("Error fetching promo code:", err);
    return null;
  }
};

const BookingItinerary = ({ itineraryId, price }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setLoading(false); // Set loading to false once the component is mounted
  }, []);

  const handleRedeem = async () => {
    const promoId = await fetchPromoCodeId(promoCode);
    if (promoId) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/tourist/usePromoCode",
          { promoCodeId: promoId, orderAmount: price },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const { discount, newTotalAmount } = response.data;
        setDiscountedPrice(newTotalAmount.toFixed(2));
        setRedeemSuccess(true);
      } catch (error) {
        setErrorMessage("Failed to apply promo code");
        setShowErrorPopup(true);
      }
    } else {
      setErrorMessage("Invalid promo code");
      setShowErrorPopup(true);
    }
  };

  const handlePayment = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true); // Set loading to true when payment process starts

    const finalPrice = redeemSuccess ? discountedPrice : price;

    try {
      switch (paymentMethod) {
        case "wallet":
          await axios.post(
            "http://localhost:8000/api/itinerary/bookItinerary",
            { itineraryId, paymentMethod: "wallet", price: finalPrice },
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
            { itineraryId, paymentMethod: "card", price: finalPrice },
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
      setErrorMessage(err.message);
      setShowErrorPopup(true);
    } finally {
      setLoading(false); // Set loading to false after payment process is complete
    }
  };

  if (loading) {
    console.log("Loading state is true");
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  console.log("Loading state is false, rendering component");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
          onClick={() => navigate(-1)}
        >
          &times;
        </button>
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Book Itinerary
        </h1>

        {/* Total Amount Section */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Itinerary Price: 
            {discountedPrice ? (
              <>
                <span className="line-through text-red-600">${Number(price).toFixed(2)}</span>
                <span className="text-green-600"> ${discountedPrice}</span>
              </>
            ) : (
              <span className="text-green-600">${Number(price).toFixed(2)}</span>
            )}
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

        {/* Promo Code Section */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter Promo Code"
            className="border p-2 rounded-md flex-grow"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            className={`px-2 py-1 rounded-md text-xs ${
              redeemSuccess ? "bg-green-500 text-white" : "bg-custom text-white"
            }`}
            onClick={handleRedeem}
            disabled={redeemSuccess}
          >
            {redeemSuccess ? "Redeemed" : "Redeem"}
          </button>
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
            disabled={loading}
          >
            Confirm Payment
          </button>
          {loading && (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
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
      <ErrorPopupComponent
        errorMessage={errorMessage}
        show={showErrorPopup}
        handleClose={() => setShowErrorPopup(false)}
      />
    </div>
  );
};

export default BookingItinerary;
