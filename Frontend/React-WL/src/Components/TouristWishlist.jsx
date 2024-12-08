import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCartForm, setShowCartForm] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        alert("Product added to cart successfully");
        setShowCartForm(false); // Hide the form after adding to cart
        setCartQuantity(1); // Reset the quantity
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart");
    }
  };

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
        alert("Product removed from wishlist successfully");
        fetchTouristWishlist(); // Refresh the wishlist after removing
      } else {
        alert("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      alert("Error removing product from wishlist");
    }
  };

  useEffect(() => {
    fetchTouristWishlist();
  }, []);

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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow-2xl w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>
        {loading ? (
            
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            
        ) : error ? (
          <h1 className="text-center text-red-500">{error}</h1>
        ) : wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div key={item._id} className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between">
                <button
                  className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => {
                    setSelectedProduct(item);
                    setShowCartForm(true);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Trash size={16} color="red" className="hover:scale-105" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Your wishlist is empty.</p>
        )}
        {showCartForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                Add {selectedProduct?.name} to Cart
              </h2>
              <label className="block mb-4">
                Quantity:
                <input
                  type="number"
                  value={cartQuantity}
                  onChange={(e) => setCartQuantity(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full mt-1"
                  min="1"
                />
              </label>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowCartForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
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
