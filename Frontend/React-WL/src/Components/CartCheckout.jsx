import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51QO30DGDvVcCb4JsAoGHQPZ25L3OMnkYdumgaiFqy1u4KBIlZcIKtWgzB8aa8irQKBiXYmft4W6USa0Iv970BdhM00oUWcviEg"
); // Add your Stripe public key here
import { useNavigate } from "react-router-dom";

const CartCheckout = ({ totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // Initialize navigate

  // Calculate the total amount
  const handleConfirmOrder = async () => {
    setError(null);
    setLoading(true);

    try {
      switch (paymentMethod) {
        case "Wallet":
          await axios.post(
            "/api/tourist/cart/checkout",
            { paymentMethod: "wallet" },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );
          alert("Payment successful using wallet");
          break;

        case "Card":
          const { data } = await axios.post(
            "/api/tourist/cart/checkout",
            { paymentMethod: "card" },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          const cardElement = elements.getElement(CardElement);
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            data.clientSecret,
            {
              payment_method: { card: cardElement },
            }
          );

          if (error) throw new Error(error.message);

          await axios.post(
            "/api/tourist/cart/paymentSuccess",
            { paymentIntentId: paymentIntent.id, totalAmount },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
              },
            }
          );

          alert("Payment successful using card");
          break;

        case "COD":
          alert("Order placed using Cash on Delivery");
          break;

        default:
          throw new Error("Please select a valid payment method");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full p-6 relative">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Checkout
        </h1>

        {/* Total Amount Section */}
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-700">
            Total Amount:{" "}
            <span className="text-green-600">${totalAmount.toFixed(2)}</span>
          </p>
        </div>

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Choose a Payment Method
          </h2>
          <div className="space-y-4">
            {/* Card Payment Option */}
            <div
              className={`border p-4 rounded-md cursor-pointer ${
                paymentMethod === "Card"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("Card")}
            >
              <h3 className="font-bold">Card Payment</h3>
              {paymentMethod === "Card" && (
                <div className="mt-2">
                  <Elements stripe={stripePromise}>
                    <CardElement className="border p-2 rounded-md" />
                  </Elements>
                </div>
              )}
            </div>

            {/* Wallet Payment Option */}
            <div
              className={`border p-4 rounded-md cursor-pointer ${
                paymentMethod === "Wallet"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("Wallet")}
            >
              <h3 className="font-bold">Wallet Payment</h3>
            </div>

            {/* Cash on Delivery Option */}
            <div
              className={`border p-4 rounded-md cursor-pointer ${
                paymentMethod === "COD"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("COD")}
            >
              <h3 className="font-bold">Cash on Delivery (COD)</h3>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-6">
          <button
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleConfirmOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default CartCheckout;
