import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../Components/Card';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const SellerSales = () => {
  const [Product, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyTourists, setMonthlyTourists] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('All');

  // Month mapping for easier readability
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchProducts();
}, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/getLoggedInUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/product/sortedByRating?sort=${sortOrder}`);
        if (response.status === 200) {
            setProducts(response.data);
        } else {
            alert('Failed to fetch products: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

  const calculateMonthlyTourists = (product) => {
    // Create a map to store tourists by month
    const monthlyTouristsMap = new Array(12).fill(0).map((_, index) => ({
      month: monthNames[index],
      tourists: 0,
      revenue: 0
    }));

    // Populate the map
    product.forEach(item => {
      // Assuming timeline.start is a date string
      const startDate = new Date(item.timeline.start);
      const monthIndex = startDate.getMonth();
      
      monthlyTouristsMap[monthIndex].tourists += item.touristCount;
      monthlyTouristsMap[monthIndex].revenue += item.price * item.touristCount;
    });

    return monthlyTouristsMap;
  }

  // Filter itineraries and monthly tourists based on selected month
  const filteredData = selectedMonth === 'All' 
    ? {
        itineraries: Product,
        monthlyTourists: monthlyTourists
      }
    : {
        itineraries: Product.filter(item => {
          const startDate = new Date(item.timeline.start);
          return monthNames[startDate.getMonth()] === selectedMonth;
        }),
        monthlyTourists: monthlyTourists.filter(m => m.month === selectedMonth)
      };

  const totalFilteredTourists = filteredData.itineraries.reduce((total, item) => total + item.touristCount, 0);
  const filteredTotalRevenue = filteredData.itineraries.reduce((total, item) => total + (item.price * item.touristCount), 0);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>
  );

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">Product Sales Report</h1>
      
      {/* Month Filter */}
      <div className="mb-6">
        <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Month
        </label>
        <select 
          id="monthSelect"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="All">All Months</option>
          {monthNames.map(month => (
            <option key={month} value={month}>{month}</option>
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
            <p className="text-2xl font-bold text-indigo-600">${filteredTotalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-green-100 rounded-full p-3 mr-4">
            <Users className="text-green-600" size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Tourists</p>
            <p className="text-2xl font-bold text-green-600">
              {totalFilteredTourists}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="bg-purple-100 rounded-full p-3 mr-4">
            <DollarSign className="text-purple-600" size={32} />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avg Product Price</p>
            <p className="text-2xl font-bold text-purple-600">
              ${(filteredTotalRevenue / (filteredData.itineraries.length || 1)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Tourists Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
          <Calendar className="mr-2" size={24} />
          Monthly Tourists Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTourists}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                name === 'tourists' ? value.toLocaleString() : `$${value.toLocaleString()}`, 
                name === 'tourists' ? 'Tourists' : 'Revenue'
              ]}
            />
            <Bar dataKey="tourists" fill="#4338ca" name="Tourists" />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Sales Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tourist Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.itineraries.map((item) => {
                const revenue = item.price * item.touristCount;
                return (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.timeline.start).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.touristCount}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">${revenue.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
     
        </>
  );
};

export default SellerSales;