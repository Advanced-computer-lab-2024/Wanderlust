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
            console.log(cartQuantity);
            const response = await axios.put(
                'http://localhost:8000/api/tourist/addProductToCart/'+selectedProduct._id,
                { quantity: cartQuantity },
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );

            if (response.status === 200) {
                alert('Product added to cart successfully');
                setShowCartForm(false); // Hide the form after adding to cart
                setCartQuantity(1); // Reset the quantity
            } else {
                alert('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Error adding product to cart');
        }
    };
    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/tourist/removeProductFromWishlist/${productId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
            );

            if (response.status === 200) {
                alert('Product removed from wishlist successfully');
                fetchTouristWishlist(); // Refresh the wishlist after removing
            } else {
                alert('Failed to remove product from wishlist');
            }
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            alert('Error removing product from wishlist');
        }
    };

    useEffect(() => {
        fetchTouristWishlist();
    }, []);

    const fetchTouristWishlist = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tourist/getWishlist", {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            });
            setWishlist(response.data.wishlist); // Adjust based on API response structure
            console.log(response.data.wishlist);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-center text-2xl font-bold text-gray-800">My Wishlist</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <h1 className="text-center text-red-500">{error}</h1>
            ) : Array.isArray(wishlist) && wishlist.length > 0 ? (
                wishlist.map((item) => (
                    <div key={item._id} className="border border-gray-300 p-4 my-2 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                        <p className="mb-1">{item.description}</p>
                        <div className="flex justify-between mt-2">
                            <div className="flex space-x-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => {
                                        setSelectedProduct(item);
                                        setShowCartForm(true);
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => handleRemoveFromWishlist(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Your wishlist is empty.</p>
            )}
            {showCartForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-md">
                        <h2 className="text-xl font-bold mb-4">Add {selectedProduct?.name} to Cart</h2>
                        <label className="block mb-2">
                            Quantity:
                            <input
                                type="number"
                                value={cartQuantity}
                                onChange={(e) => setCartQuantity(e.target.value)}
                                className="border border-gray-300 p-2 rounded-md w-full"
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
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );};

export default TouristWishlist;
