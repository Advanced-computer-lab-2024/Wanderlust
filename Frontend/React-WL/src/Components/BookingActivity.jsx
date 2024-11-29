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

const BookingActivity = ({ activityId, price }) => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();
  const handlePayment = async () => {
    const userId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/getLoggedInInfo",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        console.log(response.data);
        return response.data; // Assuming response.data contains the user ID
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const userIdValue = await userId();

    if (paymentMethod === "wallet") {
      // Wallet Payment
      try {
        const response = await axios.post(
          "/api/activity/bookActivity",
          {
            activityId,
            paymentMethod: "wallet",
            userId: userIdValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        alert(response.data.message);
      } catch (error) {
        alert(error.response.data.message);
      }
    } else if (paymentMethod === "card") {
      // Card Payment
      try {
        const response = await axios.post(
          "/api/activity/bookActivity",
          {
            activityId,
            paymentMethod: "card",
            userId: userIdValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret); // Save clientSecret to state
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
            await axios.post(
              "/api/activity/paymentSuccess",
              {
                userId: userIdValue,
                activityId,
                paymentIntentId: paymentIntent.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
              }
            );
            alert("Booking confirmed and actions completed!");
          }
        }
      } catch (error) {
        console.error(error.message);
        alert("Failed to initiate card payment");
      }
    }
  };

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

      <button onClick={handlePayment}>Pay {price} USD</button>
    </div>
  );
};

export default BookingActivity;
