import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8000/api/tourist/viewOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data.order); // Adjust based on API response structure
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="p-5 max-w-3xl mx-auto">
        <h1 className="text-center text-2xl font-bold text-gray-800">Order Details</h1>
        {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
            <h1 className="text-center text-red-500">{error}</h1>
        ) : order ? (
            <div className="border border-gray-300 p-4 my-2 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Order ID: {order._id}</h3>
                <p className="mb-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                <p className="mb-1">Total Amount: ${order.totalAmount.toFixed(2)}</p>
                <p className="mb-1">Status: {order.status}</p>
                <h4 className="font-semibold mt-2">Items:</h4>
                <ul>
                    {order.items.map((item) => (
                        <li key={item.product._id} className="border-b border-gray-200 py-2">
                            <div className="flex items-center">
                                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded mr-4" />
                                <div>
                                    <h5 className="text-lg font-semibold">{item.product.name}</h5>
                                    <p className="text-gray-600">{item.product.description}</p>
                                    <p className="text-gray-800">Quantity: {item.quantity}</p>
                                    <p className="text-gray-800">Price: ${item.price.toFixed(2)}</p>
                                    <p className="text-gray-800">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        ) : (
            <p className="text-center text-gray-500">Order not found.</p>
        )}
    </div>
);
};

export default OrderDetails;