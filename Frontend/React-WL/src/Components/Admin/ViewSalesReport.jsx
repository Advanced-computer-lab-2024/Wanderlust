import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewSalesReport = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/allSalesReport');
        setSalesReport(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 w-75">
      <h1 className="mb-4 text-2xl font-bold mb-6 text-center">Sales Report</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Total Revenue</th>
            <th>App Revenue</th>
            <th>Number of Itineraries</th>
            <th>Number of Activities</th>
            <th>Number of Products</th>
            <th>Generated At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${salesReport.totalRevenue.toFixed(2)}</td>
            <td>${salesReport.appRevenue.toFixed(2)}</td>
            <td>{salesReport.numberOfItineraries}</td>
            <td>{salesReport.numberOfActivities}</td>
            <td>{salesReport.numberOfProducts}</td>
            <td>{new Date(salesReport.generatedAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <h2 className="mt-4 mb-4 text-2xl font-bold mb-6 text-center">Itineraries</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.itineraries.map((itinerary, index) => (
            <tr key={index}>
              <td>{itinerary.title}</td>
              <td>{itinerary.creator}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4 mb-4 text-2xl font-bold mb-6 text-center">Activities</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.activities.map((activity, index) => (
            <tr key={index}>
              <td>{activity.name}</td>
              <td>{activity.creator}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4 mb-4 text-2xl font-bold mb-6 text-center">Products</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {salesReport.products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.creator}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSalesReport;