import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8000/api/tourist/viewAllOrders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.orderHistory);
            setOrders(response.data.orderHistory); // Adjust based on API response structure
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-center text-2xl font-bold text-gray-800">My Orders</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <h1 className="text-center text-red-500">{error}</h1>
            ) : orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order._id} className="border border-gray-300 p-4 my-2 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Order ID: {order._id}</h3>
                        <p className="mb-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p className="mb-1">Total Amount: ${order.totalAmount.toFixed(2)}</p>
                        <h4 className="font-semibold mt-2">Items:</h4>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.product._id}>
                                    {item.product.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="mt-2 text-blue-500 hover:underline"
                            onClick={() => window.location.href = `/OrderDetails/${order._id}`}
                        >
                            View Details
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">You have no orders.</p>
            )}
        </div>
    );
};

export default TouristOrders;