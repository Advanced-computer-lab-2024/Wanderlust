import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristCart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTouristCart();
    }, []);

    const fetchTouristCart = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tourist/getCart", {
                headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
            });
            setCart(response.data.cart); // Adjust based on API response structure
            console.log(response.data.cart);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-center text-2xl font-bold text-gray-800">My Cart</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <h1 className="text-center text-red-500">{error}</h1>
            ) : Array.isArray(cart) && cart.length > 0 ? (
                cart.map((item) => (
                    <div key={item._id} className="border border-gray-300 p-4 my-2 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">{item.product.name}</h3>
                        <p className="mb-1">{item.product.description}</p>
                        <p className="mb-1">Quantity: {item.quantity}</p>
                        <p className="font-bold">Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
        <div className="mt-5"></div>
        </div>
    );
};

export default TouristCart;
