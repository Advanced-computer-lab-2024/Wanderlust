import React, { useState, useEffect } from "react";
import axios from "axios";

const Salestg = ({ tourGuideId }) => {
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/tourGuide/salesReport/${tourGuideId}`
        );
        setSalesReport(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [tourGuideId]);

  if (loading) {
    return (
      <div style={styles.container}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, ...styles.error }}>
        Error: {error}
      </div>
    );
  }

  if (!salesReport || !salesReport.activities.length) {
    return (
      <div style={styles.container}>
        No sales data available.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sales Report</h2>
      <div style={styles.summary}>
        <p>Total Revenue: <span style={styles.highlight}>${salesReport.totalRevenue.toFixed(2)}</span></p>
        <p>Activities Count: <span style={styles.highlight}>{salesReport.activities.length}</span></p>
      </div>
      <div style={styles.details}>
        <h3 style={styles.detailsTitle}>Activities Breakdown</h3>
        <ul style={styles.list}>
          {salesReport.activities.map((activity, index) => (
            <li key={index} style={styles.listItem}>
              <div style={styles.activityName}>{activity.activityName}</div>
              <div>
                Revenue: <span style={styles.highlight}>${activity.revenue.toFixed(2)}</span>
              </div>
              <div>
                Date: <span style={styles.highlight}>{new Date(activity.date).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    maxWidth: "800px",
    margin: "20px auto",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "16px",
  },
  summary: {
    marginBottom: "24px",
  },
  highlight: {
    fontWeight: "bold",
    color: "#007bff",
  },
  details: {
    marginTop: "16px",
  },
  detailsTitle: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "12px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  activityName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default Salestg;