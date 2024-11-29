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
//remove done
    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.delete(`http://localhost:8000/api/tourist/removeFromCart/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchTouristCart(); // Fetch the updated cart from the server
        } catch (error) {
            console.error('Error removing item from cart:', error.response ? error.response.data : error.message);
            setError(error.message);
        }
    };
    // change the quantity of the item in the cart
    const changeCartItemQuantity = async (productId, quantity) => {
        try {
            const token = localStorage.getItem("jwtToken");
            await axios.put(`http://localhost:8000/api/tourist/cart/changeQuantity/${productId}`, {
                quantity,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchTouristCart(); // Fetch the updated cart from the server
        } catch (error) {
            console.error('Error changing item quantity:', error.response ? error.response.data : error.message);
            setError(error.message);
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
                    <div key={item._id} className="border border-gray-300 p-4 my-2 rounded-md flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{item.product.name}</h3>
                            <p className="mb-1">{item.product.description}</p>
                            <p className="mb-1">Quantity: {item.quantity}</p>
                            <p className="font-bold">Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <button
                                onClick={() => removeFromCart(item.product._id)}
                                className="text-red-500 hover:text-red-700 mb-2"
                            >
                                Remove
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => changeCartItemQuantity(item.product._id, e.target.value)}
                                className="p-1 border border-gray-300 rounded"
                                min="1"
                            />
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Your cart is empty.</p>
            )}
        </div>
    );
};

export default TouristCart;


