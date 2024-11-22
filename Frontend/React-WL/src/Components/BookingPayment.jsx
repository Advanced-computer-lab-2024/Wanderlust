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

const BookingPayment = ({ bookingId, amount }) => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const handlePayment = async () => {
    if (paymentMethod === "wallet") {
      // Wallet Payment
      try {
        const response = await axios.post("/api/tourist/bookEvent", {
          bookingId,
          amount,
          paymentMethod: "wallet",
        });
        alert(response.data.message);
      } catch (error) {
        alert(error.response.data.message);
      }
    } else if (paymentMethod === "card") {
      // Card Payment
      try {
        const response = await axios.post("/api/tourist/bookEvent", {
          bookingId,
          amount,
          paymentMethod: "card",
        });

        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret); // Save clientSecret
        }
      } catch (error) {
        alert("Failed to initiate card payment");
      }
    }
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      alert(error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment successful via card");
    }
  };
  // Automatically trigger card payment when clientSecret is available
  useEffect(() => {
    if (clientSecret) {
      handleCardPayment();
    }
  }, [clientSecret]);

  return (
    <div>
      <h2>Choose Payment Method</h2>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="wallet">Wallet</option>
        <option value="card">Card</option>
      </select>

      {paymentMethod === "card" && (
        <Elements stripe={stripePromise}>
          <CardElement />
        </Elements>
      )}

      <button onClick={handlePayment}>Pay {amount} USD</button>
    </div>
  );
};
