import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TouristCart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTouristCart();
  }, []);

  const fetchTouristCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/tourist/getCart",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setCart(response.data.cart);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(
        `http://localhost:8000/api/tourist/removeFromCart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTouristCart();
    } catch (error) {
      setError(error.message);
    }
  };

  const changeCartItemQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8000/api/tourist/cart/changeQuantity/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTouristCart();
    } catch (error) {
      setError(error.message);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    // Ensure item and its properties exist
    const price = item?.product?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + price * quantity;
  }, 0);

  const checkoutOrder = () => {
    navigate("/CartCheckoutPage", { state: { totalAmount: totalAmount } });
  };

  return (
    <StyledWrapper>
      <div className="master-container">
        <div className="card cart">
          <label className="title">My Cart</label>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <h1 className="text-center text-red-500">{error}</h1>
          ) : cart.length > 0 ? (
            <div className="products">
              {cart.map((item, index) => {
                if (!item || !item.product) {
                  console.warn(
                    `Missing product data for item at index ${index}`,
                    item
                  );
                  return null; // Skip rendering this item
                }

                return (
                  <div key={item._id || index} className="product">
                    <div className="product-details">
                      <span>{item.product.name}</span>
                      <p>{item.product.description}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        Total: $
                        {(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="actions">
                      <div className="quantity">
                        <button
                          onClick={() =>
                            changeCartItemQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                        >
                          -
                        </button>
                        <label>{item.quantity}</label>
                        <button
                          onClick={() =>
                            changeCartItemQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="remove-button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="card checkout">
          <label className="title">Checkout</label>
          <div className="checkout--footer">
            <label className="price">
              <sup>$</sup>
              {totalAmount.toFixed(2)}
            </label>
            <button className="checkout-btn" onClick={checkoutOrder}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .master-container {
    display: flex;
    flex-direction: column; /* Ensures elements are stacked vertically */
    gap: 20px; /* Added spacing between the two cards */
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .card {
    width: 600px; /* Increased width */
    background: #ffffff;
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01),
      0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09),
      0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
  }

  .title {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #efeff3;
    font-weight: 700;
    font-size: 16px;
    color: #63656b;
  }

  .products {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .product {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    background: #f9f9f9;
  }

  .product-details {
    flex: 1;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 15px; /* Added spacing between remove button and quantity controls */
  }

  .quantity {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .quantity button {
    background: #ffffff;
    color: #000000; /* Black icons */
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .quantity button:hover {
    background: #f0f0f0;
  }

  .remove-button {
    background: none;
    color: #ff0000;
    border: none;
    cursor: pointer;
    font-size: 12px;
  }

  .checkout {
    border-radius: 9px 9px 19px 19px;
  }

  .checkout--footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f4f4f4;
  }

  .price {
    font-size: 18px;
    font-weight: bold;
    color: #2b2b2f;
  }

  .checkout-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 40px;
    background: linear-gradient(180deg, #4480ff 0%, #115dfc 50%, #0550ed 100%);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
  }

  .checkout-btn:hover {
    background: #115dfc;
  }
`;

export default TouristCart;
