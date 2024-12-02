import React from "react";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import CartCheckout from "../../Components/CartCheckout";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QO30DGDvVcCb4JsAoGHQPZ25L3OMnkYdumgaiFqy1u4KBIlZcIKtWgzB8aa8irQKBiXYmft4W6USa0Iv970BdhM00oUWcviEg"
);

const CartCheckoutPage = () => {
  const location = useLocation();
  const { totalAmount } = location.state || {}; // Destructure data from state

  return (
    <>
      <TouristNavBar />
      <Elements stripe={stripePromise}>
        <CartCheckout totalAmount={totalAmount} />
      </Elements>
    </>
  );
};

export default CartCheckoutPage;
