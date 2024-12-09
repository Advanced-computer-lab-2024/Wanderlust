import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";

const TouristWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCartForm, setShowCartForm] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null); // For inline notifications

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchTouristWishlist();
  }, []);

  // Function to fetch wishlist items
  const fetchTouristWishlist = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/tourist/getWishlist",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setWishlist(response.data.wishlist); // Adjust based on API response structure
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch wishlist.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a product to the cart
  const handleAddToCart = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/tourist/addProductToCart/${selectedProduct._id}`,
        { quantity: cartQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setNotification({
          type: "success",
          message: "Product added to cart successfully.",
        });
        setShowCartForm(false); // Hide the form after adding to cart
        setCartQuantity(1); // Reset the quantity
      } else {
        setNotification({
          type: "error",
          message: "Failed to add product to cart.",
        });
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Error adding product to cart.",
      });
    }
  };

  // Function to handle removing a product from the wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/tourist/removeProductFromWishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        setNotification({
          type: "success",
          message: "Product removed from wishlist successfully.",
        });
        fetchTouristWishlist(); // Refresh the wishlist after removing
      } else {
        setNotification({
          type: "error",
          message: "Failed to remove product from wishlist.",
        });
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      setNotification({
        type: "error",
        message:
          error.response?.data?.message ||
          "Error removing product from wishlist.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        {/* Header */}
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#003580" }} // Booking.com blue
        >
          My Wishlist
        </h1>

        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded ${
              notification.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div
              className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
              style={{
                borderTopColor: "#003580",
                borderBottomColor: "#003580",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
              }}
            ></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : wishlist.length > 0 ? (
          <div className="space-y-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg mr-4"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-blue-900" style={{ color: '#003580' }}>{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="mt-2">
                      <p className="text-gray-800">
                        Price: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>${item.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition transform hover:scale-105"
                    onClick={() => {
                      setSelectedProduct(item);
                      setShowCartForm(true);
                    }}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="text-red-600 hover:text-red-800 transition transform hover:scale-105"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        )}

        {/* Add to Cart Modal */}
        {showCartForm && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: "#003580" }} // Booking.com blue
              >
                Add {selectedProduct.name} to Cart
              </h2>
              <label className="block mb-4">
                Quantity:
                <input
                  type="number"
                  value={cartQuantity}
                  onChange={(e) =>
                    setCartQuantity(
                      e.target.value < 1 ? 1 : parseInt(e.target.value)
                    )
                  }
                  className="mt-1 w-full border border-gray-300 p-2 rounded-md"
                  min="1"
                />
              </label>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition transform hover:scale-105"
                  onClick={() => setShowCartForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition transform hover:scale-105"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristWishlist;
