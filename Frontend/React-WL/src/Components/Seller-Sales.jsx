
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SellerSales = () => {
  // State variables
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    appRevenue: 0,
    numberOfProducts: 0,
    products: [],
    generatedAt: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('All');

  // Fetch seller revenue data
  const fetchSellerRevenue = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8000/api/Seller/getsalesreportseller', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSalesData(response.data);
      setLoading(false);
      console.log("Seller revenue data:", response.data);
    } catch (error) {
      console.error("Error fetching seller revenue:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch revenue on component mount
  useEffect(() => {
    fetchSellerRevenue();
  }, []);

  // Prepare chart data for monthly revenue
  const prepareChartData = () => {
    // This is a mock implementation. You'd want to get actual monthly data from your backend
    return [
      { month: 'Jan', revenue: salesData.totalRevenue * 0.7 },
      { month: 'Feb', revenue: salesData.totalRevenue * 0.9 },
      { month: 'Mar', revenue: salesData.totalRevenue }
    ];
  };

  // Filter products based on selection
  const filteredProducts = selectedProduct === 'All' 
    ? salesData.products 
    : salesData.products.filter(product => product.name === selectedProduct);

  // Loading and error states
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Seller Sales Report</h1>
      
      {/* Product Filter */}
      <div className="mb-6">
        <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Product
        </label>
        <select 
          id="productSelect"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="All">All Products</option>
          {salesData.products.map(product => (
            <option key={product.name} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-indigo-100 rounded-full p-3 mr-4">
            <TrendingUp className="text-indigo-600" size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${salesData.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <Users className="text-green-600" size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Number of Products</p>
            <p className="text-2xl font-bold text-green-600">
              {salesData.numberOfProducts}
            </p>
          </div>
        </div>
       
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
          <Calendar className="mr-2" size={24} />
          Monthly Revenue Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prepareChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creator
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.creator}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Generation Details */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Report Generated: {salesData.generatedAt 
          ? new Date(salesData.generatedAt).toLocaleString() 
          : 'N/A'}
      </div>
    </div>
  );
};

export default SellerSales;