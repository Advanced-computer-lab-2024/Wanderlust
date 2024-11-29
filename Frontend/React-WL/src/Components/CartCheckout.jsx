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

const CartCheckout = ({ cart }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // Initialize navigate

  // Calculate the total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleConfirmOrder = () => {
    if (paymentMethod === "Card") {
      const cardElement = elements.getElement(CardElement);
      // Logic to handle card payment using Stripe
      console.log("Processing card payment...");
    } else if (paymentMethod === "Wallet" || paymentMethod === "COD") {
      // Logic for wallet or COD payment
      console.log(`Processing ${paymentMethod} payment...`);
    } else {
      console.error("No payment method selected!");
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-center text-2xl font-bold text-gray-800">Checkout</h1>

      {/* Total Amount Section */}
      <div className="mt-4 text-lg font-semibold">
        <p>
          Total Amount to be Paid:{" "}
          <span className="text-green-600">${totalAmount.toFixed(2)}</span>
        </p>
      </div>

      {/* Payment Method Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Choose a Payment Method</h2>
        <div className="grid grid-cols-1 gap-4">
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
                <CardElement className="border p-2 rounded-md" />
                {/* You can style CardElement further as needed */}
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
            {paymentMethod === "Wallet" && (
              <div className="mt-2">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleConfirmOrder}
                >
                  Confirm Payment
                </button>
              </div>
            )}
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
            {paymentMethod === "COD" && (
              <div className="mt-2">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleConfirmOrder}
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
