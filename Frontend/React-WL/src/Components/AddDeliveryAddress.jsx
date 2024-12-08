import React, { useState } from "react";
import axios from "axios";

const AddDeliveryAddress = () => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    floor: "",
    apartment: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authorization token is missing.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/tourist/addDeliveryAddress",
        { address: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      setFormData({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        floor: "",
        apartment: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Add Delivery Address</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-800 font-semibold"
              htmlFor="street"
            >
              Street<span className="text-red-500"> *</span>
            </label>
            <input
              id="street"
              placeholder="Street"
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 font-semibold" htmlFor="city">
              City<span className="text-red-500"> *</span>
            </label>
            <input
              id="city"
              placeholder="City"
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6 flex space-x-2">
            <div className="flex-1">
              <label
                className="block text-gray-800 font-semibold"
                htmlFor="state"
              >
                State<span className="text-red-500"> *</span>
              </label>
              <input
                id="state"
                placeholder="State"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-gray-800 font-semibold"
                htmlFor="zipCode"
              >
                ZIP Code<span className="text-red-500"> *</span>
              </label>
              <input
                id="zipCode"
                placeholder="ZIP Code"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-800 font-semibold"
              htmlFor="country"
            >
              Country<span className="text-red-500"> *</span>
            </label>
            <select
              id="country"
              className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
            </select>
          </div>
          <div className="mb-6 flex space-x-2">
            <div className="flex-1">
              <label
                className="block text-gray-800 font-semibold"
                htmlFor="floor"
              >
                Floor<span className="text-red-500"> *</span>
              </label>
              <input
                id="floor"
                placeholder="Floor"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                value={formData.floor}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-gray-800 font-semibold"
                htmlFor="apartment"
              >
                Apartment<span className="text-red-500"> *</span>
              </label>
              <input
                id="apartment"
                placeholder="Apartment"
                className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                value={formData.apartment}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            className="w-full bg-custom text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDeliveryAddress;
