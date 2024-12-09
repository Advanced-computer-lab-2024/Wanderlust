import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); // For navigation
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null); // To handle individual order cancellation loading

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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
      fetchOrderDetails(); // Refresh orders after cancellation
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      alert('Failed to cancel order: ' + (error.response?.data?.message || error.message));
    } finally {
      setCancellingOrderId(null); // End cancellation loading state
    }
  };

  return (
    <>
      <div className="p-5 max-w-5xl mx-auto">
        {/* Back to Orders Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-900 hover:text-blue-700 mb-6"
          aria-label="Back to Orders"
          style={{ color: '#003580' }} // Exact Booking.com blue
        >
          <FaArrowLeft className="mr-2" />
          Back to Orders
        </button>

        {/* Header */}
        <h1 className="text-center text-3xl font-bold text-blue-900 mb-6" style={{ color: '#003580' }}>
          Order Details
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-900" style={{ borderTopColor: '#003580', borderBottomColor: '#003580' }}></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Order Details */}
        {!loading && !error && order && (
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-2" style={{ color: '#003580' }}>
                Order ID: {order._id}
              </h2>
              <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
              <p className="text-gray-600">
                Status: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>{order.status}</span>
              </p>
              <p className="text-gray-600">
                Total Amount: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>${order.totalAmount.toFixed(2)}</span>
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4" style={{ color: '#003580' }}>Items:</h3>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.product._id} className="flex flex-col md:flex-row items-center border border-gray-200 rounded-lg p-4">
                    {/* Product Image */}
                    <img
                      src={item.product.picture}
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded-lg mr-4"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-blue-900" style={{ color: '#003580' }}>{item.product.name}</h4>
                      <p className="text-gray-600">{item.product.description}</p>
                      <div className="mt-2">
                        <p className="text-gray-800">
                          Quantity: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>{item.quantity}</span>
                        </p>
                        <p className="text-gray-800">
                          Price: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>${item.price.toFixed(2)}</span>
                        </p>
                        <p className="text-gray-800">
                          Total: <span className="font-medium text-blue-900" style={{ color: '#003580' }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Order Not Found */}
        {!loading && !error && !order && (
          <p className="text-center text-gray-500">Order not found.</p>
        )}
      </div>
    </>
  );
};

export default OrderDetails;
