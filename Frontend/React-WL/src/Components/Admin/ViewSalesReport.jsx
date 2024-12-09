import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewSalesReport = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    product: '',
    startDate: '',
    endDate: '',
    month: '',
    year: '',
  });

  const fetchSalesReport = async (filters) => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/filterSalesReport', { params: filters });
      setSalesReport(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesReport(filters);
  }, []); // Empty dependency array to run only once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    fetchSalesReport(filters); // Fetch the filtered data
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 w-75">
      <h1 className="mb-4 text-2xl font-bold mb-6 text-center">Sales Report</h1>

      <form onSubmit={handleFilterSubmit} className="mb-4 card p-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="product" className="form-label">Product Name</label>
            <input
              type="text"
              id="product"
              name="product"
              value={filters.product}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Product Name"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Start Date"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="form-control"
              placeholder="End Date"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="month" className="form-label">Month</label>
            <input
              type="number"
              id="month"
              name="month"
              value={filters.month}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Month"
            />
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="year" className="form-label">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={filters.year}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Year"
            />
          </div>
          <div className="col-md-3 mb-3 align-self-end">
            <button type="submit" className="btn btn-primary">Filter</button>
          </div>
        </div>
      </form>

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

      <h2 className="mt-4 text-2xl font-bold mb-2 text-center">Itineraries</h2>
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

      <h2 className="mt-4 text-2xl font-bold mb-2 text-center">Activities</h2>
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

      <h2 className="mt-4 text-2xl font-bold mb-2 text-center">Products</h2>
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