import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTouristCart();
    }, []);

    const fetchTouristCart = async () => {
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
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
        <div className="mt-5"></div>
        </div>
    );
};

export default TouristWishlist;
