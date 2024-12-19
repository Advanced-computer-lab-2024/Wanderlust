import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/adminstyle.css'
const FlagItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/itinerary/itineraryAdmin');
      setItineraries(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error);
    }
  };

  const handleFlagItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/itinerary/itinerary/${id}/flag`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      if (response.status === 200) {
        alert('Itinerary flagged successfully');
        fetchItineraries();
      } else {
        alert('Failed to flag itinerary: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error flagging itinerary:', error);
      alert('Error flagging itinerary: ' + error.message);
    }
  };

  const handleUnflagItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/itinerary/itinerary/${id}/unflag`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });
      if (response.status === 200) {
        alert('Itinerary unflagged successfully');
        fetchItineraries();
      } else {
        alert('Failed to unflag itinerary: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error unflagging itinerary:', error);
      alert('Error unflagging itinerary: ' + error.message);
    }
  };

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error.message}</span>
    </div>
  );

  return (
    <div className="container py-4 w-75">
      <div className="mb-4">
        <h1 className="text-center mb-4 text-2xl font-bold mb-6 text-center ">Flag Itinerary</h1>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Flagged</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {itineraries.map((itinerary) => (
            <tr key={itinerary._id}>
              <td>{itinerary.title}</td>
              <td>{itinerary.creator}</td>
              <td>{itinerary.status}</td>
              <td>{itinerary.flagged ? 'Yes' : 'No'}</td>
              <td>
                {itinerary.flagged ? (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleUnflagItinerary(itinerary._id)}
                  >
                    Unflag
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleFlagItinerary(itinerary._id)}
                  >
                    Flag
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlagItinerary;