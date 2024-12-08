import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TouristOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wallet, setWallet] = useState(0);

    useEffect(() => {
        fetchOrders();
        fetchTouristProfile();
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

    const fetchTouristProfile = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:8000/api/tourist/getTourist', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setWallet(response.data.wallet); // Assuming the API response contains the wallet balance
        } catch (error) {
            console.error('Failed to fetch tourist profile:', error.message);
        }
    };

    const cancelOrder = async (orderId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to get user info
            const touristId = decoded.id;

            await axios.delete(`http://localhost:8000/api/tourist/cancelOrder/${touristId}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Order canceled successfully');
            fetchOrders(); // Refresh orders after cancellation
            fetchTouristProfile(); // Refresh wallet balance after cancellation
        } catch (error) {
            alert('Failed to cancel order: ' + error.message);
        }
    };

    return (
        <div className="p-5 max-w-3xl mx-auto">
            <h1 className="text-center text-2xl font-bold text-gray-800">My Orders</h1>
            {loading ? (
                
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                   
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
                        <button
                            className="mt-2 ml-4 text-red-500 hover:underline"
                            onClick={() => cancelOrder(order._id)}
                        >
                            Cancel Order
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