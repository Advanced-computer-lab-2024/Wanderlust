import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

const TouristCart = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTouristCart();
    fetchDeliveryAddresses();
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

  const fetchDeliveryAddresses = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setAddressError("Authorization token is missing.");
        return;
      }
      const response = await axios.get(
        "http://localhost:8000/api/tourist/deliveryAddresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAddresses(response.data.deliveryAddresses || []);
    } catch (err) {
      setAddressError(
        err.response?.data?.message ||
          "An error occurred while fetching addresses."
      );
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
    const price = item?.product?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + price * quantity;
  }, 0);

  const checkoutOrder = () => {
    if (!selectedAddress) {
      setAddressError("Please select a delivery address before proceeding.");
      return;
    }
    navigate("/CartCheckoutPage", {
      state: { totalAmount: totalAmount, address: selectedAddress },
    });
  };
  const navigateToAddAddress = () => {
    navigate("/PopupAddDeliveryAddress");
  };

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
    setAddressError(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded shadow-2xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6">My Cart</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <h1 className="text-center text-red-500">{error}</h1>
        ) : cart.length > 0 ? (
          <div className="mb-6">
            {cart.map((item, index) => {
              if (!item || !item.product) {
                console.warn(
                  `Missing product data for item at index ${index}`,
                  item
                );
                return null;
              }

              return (
                <div key={item._id || index} className="border-b pb-4 mb-4">
                  <div className="text-gray-800 font-semibold">
                    {item.product.name}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {item.product.description}
                  </p>
                  <p className="text-gray-800 text-sm">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-800 text-sm">
                    Total: ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          changeCartItemQuantity(
                            item.product._id,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          changeCartItemQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <Trash
                        size={16}
                        color="red"
                        className="hover:scale-105"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}

        <div className="mb-6">
          <label
            htmlFor="addresses"
            className="block text-gray-800 font-semibold mb-2"
          >
            Select Delivery Address<span className="text-red-500"> *</span>
          </label>
          <div className="flex space-x-2">
            <select
              id="addresses"
              value={selectedAddress}
              onChange={handleAddressChange}
              className="flex-1 border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="">Select an address</option>
              {addresses.map((address, index) => (
                <option key={index} value={address.street}>
                  {`${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}
                </option>
              ))}
            </select>
            <button
              onClick={navigateToAddAddress}
              className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add
            </button>
          </div>
          {addressError && <p className="text-red-500 mt-2">{addressError}</p>}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-semibold">Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-800 font-semibold">Delivery Fees:</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${(totalAmount + 5).toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={checkoutOrder}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristCart;
