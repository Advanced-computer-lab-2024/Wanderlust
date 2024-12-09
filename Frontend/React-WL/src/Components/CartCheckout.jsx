import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ErrorPopupComponent from "./ErrorPopupComponent";

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

const CartCheckout = ({ totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleRedeem = async () => {
    const promoId = await fetchPromoCodeId(promoCode);
    if (promoId) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/tourist/usePromoCode",
          { promoCodeId: promoId, orderAmount: totalAmount },
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

  const handleConfirmOrder = async () => {
    setError(null);
    setLoading(true);
    setSuccess(false);

    const finalPrice = redeemSuccess ? discountedPrice : totalAmount;

    try {
      switch (paymentMethod) {
        case "Wallet":
          await axios.post(
            "http://localhost:8000/api/tourist/cart/checkout",
            { paymentMethod: "wallet", totalAmount: finalPrice },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          setSuccess(true);
          break;

        case "Card":
          const { data } = await axios.post(
            "http://localhost:8000/api/tourist/cart/checkout",
            { paymentMethod: "card", totalAmount: finalPrice },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          const cardElement = elements.getElement(CardElement);
          if (!cardElement) throw new Error("Card details are required.");
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            data.clientSecret,
            { payment_method: { card: cardElement } }
          );
          if (error) throw new Error(error.message);

          await axios.post(
            "http://localhost:8000/api/tourist/cart/paymentSuccess",
            { paymentIntentId: paymentIntent.id, totalAmount: finalPrice },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          setSuccess(true);
          break;

        case "COD":
          setSuccess(true);
          break;

        default:
          throw new Error("Please select a payment method.");
      }
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
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
          Checkout
        </h1>

        {/* Total Amount Section */}
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold text-gray-700">
            Total Amount:{" "}
            {discountedPrice ? (
              <>
                <span className="line-through text-red-600">${totalAmount.toFixed(2)}</span>
                <span className="text-green-600"> ${discountedPrice}</span>
              </>
            ) : (
              <span className="text-green-600">${totalAmount.toFixed(2)}</span>
            )}
          </p>
        </div>

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Choose a Payment Method
          </h2>
          <div className="flex justify-between space-x-4">
            <div
              className={`border p-4 rounded-md cursor-pointer flex-1 text-center ${
                paymentMethod === "Card"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("Card")}
            >
              <h3 className="font-bold">Card</h3>
            </div>
            <div
              className={`border p-4 rounded-md cursor-pointer flex-1 text-center ${
                paymentMethod === "Wallet"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("Wallet")}
            >
              <h3 className="font-bold">Wallet</h3>
            </div>
            <div
              className={`border p-4 rounded-md cursor-pointer flex-1 text-center ${
                paymentMethod === "COD"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <h3 className="font-bold">COD</h3>
            </div>
          </div>
        </div>

        {/* Render CardElement Below Payment Options */}
        {paymentMethod === "Card" && (
          <div className="mt-4">
            <CardElement className="border p-2 rounded-md" />
          </div>
        )}

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

        {/* Confirm Payment Button */}
        <div className="mt-6">
          <button
            className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleConfirmOrder}
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
          <div className="mt-4 text-green-500 text-center">
            Payment successful! Your order has been placed.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-center">
            <p>Error: {error}</p>
          </div>
        )}

        <ErrorPopupComponent
          errorMessage={errorMessage}
          show={showErrorPopup}
          handleClose={() => setShowErrorPopup(false)}
        />
      </div>
    </div>
  );
};

export default CartCheckout;
