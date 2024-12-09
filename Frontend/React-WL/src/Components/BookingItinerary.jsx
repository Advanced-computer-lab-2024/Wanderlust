import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import ErrorPopupComponent from "./ErrorPopupComponent";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();

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
    setLoading(true);

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
          if (!cardElement) throw new Error("CardElement not found");

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
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow-2xl w-full max-w-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="ml-2">Back</span>
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Book Itinerary
        </h1>

        {/* Price Section */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Itinerary Price:{" "}
            {discountedPrice ? (
              <>
                <span className="line-through text-red-600">
                  ${Number(price).toFixed(2)}
                </span>
                <span className="text-green-600"> ${discountedPrice}</span>
              </>
            ) : (
              <span className="text-green-600">
                ${Number(price).toFixed(2)}
              </span>
            )}
          </p>
        </div>

        {/* Payment Method Section */}
        <div className="flex justify-between space-x-4 mb-8">
          <div
            className={`border p-4 rounded-md cursor-pointer w-1/2 text-center transition-all duration-300 ${
              paymentMethod === "card"
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("card")}
          >
            <h3 className="font-bold">Card</h3>
          </div>
          <div
            className={`border p-4 rounded-md cursor-pointer w-1/2 text-center transition-all duration-300 ${
              paymentMethod === "wallet"
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("wallet")}
          >
            <h3 className="font-bold">Wallet</h3>
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

        {/* Card Element */}
        {paymentMethod === "card" && (
          <div className="mt-4">
            <CardElement className="border p-2 rounded-md" />
          </div>
        )}

        {/* Confirm Payment Button */}
        <div className="mt-6">
          <button
            className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handlePayment}
            disabled={loading}
          >
            Confirm Payment
          </button>
          {loading && (
            <p className="text-center mt-2 text-gray-500">
              Processing your payment...
            </p>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-green-500 text-center font-semibold">
            Booking Confirmed! Thank you.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-center font-medium">
            {error}
          </div>
        )}
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
