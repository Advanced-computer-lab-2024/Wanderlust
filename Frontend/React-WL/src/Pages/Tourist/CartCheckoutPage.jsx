import React from "react";
import TouristNavBar from "../../Components/NavBars/TouristNavBar";
import CartCheckout from "../../Components/CartCheckout";
import { useLocation } from "react-router-dom";

const CartCheckoutPage = () => {
  const location = useLocation();
  const { totalAmount } = location.state || {}; // Destructure data from state

  return (
    <>
      <TouristNavBar />
      <CartCheckout totalAmount={totalAmount} />
    </>
  );
};

export default CartCheckoutPage;
