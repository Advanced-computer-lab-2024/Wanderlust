import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaTimes } from 'react-icons/fa';

const TouristOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null); // To handle individual order cancellation loading

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
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        try {
            setCancellingOrderId(orderId); // Start cancellation loading state
            const token = localStorage.getItem('jwtToken');
            const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to get user info
            const touristId = decoded.id;

            await axios.delete(`http://localhost:8000/api/tourist/cancelOrder/${touristId}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Show success message
            setError(null);
            alert('Order canceled successfully');
            fetchOrders(); // Refresh orders after cancellation
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            alert('Failed to cancel order: ' + (error.response?.data?.message || error.message));
        } finally {
            setCancellingOrderId(null); // End cancellation loading state
        }
    };

    return (
        <>
            <div className="p-5 max-w-4xl mx-auto">
                {/* Orders Section */}
                <h1 className="text-center text-2xl font-bold text-blue-700 mb-6">My Orders</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-blue-700 p-6 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-blue-700">Order ID: {order._id}</h3>
                                    <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700 mb-2">Total Amount: <span className="font-medium text-blue-700">${order.totalAmount.toFixed(2)}</span></p>
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Items:</h4>
                                    <ul className="list-disc list-inside">
                                        {order.items.map((item) => (
                                            <li key={item.product._id} className="text-gray-600">
                                                {item.product.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 focus:outline-none transition-colors duration-200 text-sm"
                                        onClick={() => window.location.href = `/OrderDetails/${order._id}`}
                                        aria-label={`View details for order ${order._id}`}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none transition-colors duration-200 text-sm ${cancellingOrderId === order._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => cancelOrder(order._id)}
                                        disabled={cancellingOrderId === order._id}
                                        aria-label={`Cancel order ${order._id}`}
                                    >
                                        {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You have no orders.</p>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-blue-700 text-white py-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} Wanderlust. All Rights Reserved.</p>
                    <p className="text-sm">Need help? Contact us at <a href="mailto:support@Wanderlust.com" className="underline hover:text-blue-300">support@Wanderlust.com</a></p>
                </div>
            </footer>
        </>
    );
};

export default TouristOrders;
