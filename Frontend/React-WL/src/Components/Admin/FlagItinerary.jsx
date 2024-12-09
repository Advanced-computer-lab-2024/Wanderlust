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
      const response = await axios.get('http://localhost:8000/api/itinerary/getitinerary');
      setItineraries(response.data);
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
        <h1 className='text-2xl font-bold mb-6'>Itineraries</h1>
      </div>
      <div className="row">
        {itineraries.map(itinerary => (
          <div key={itinerary._id} className="col-md-4 mb-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold">{itinerary.title}</h2>
              <p className="text-gray-700">{itinerary.description}</p>
              <p className="text-gray-700">Price: ${itinerary.price}</p>
              <p className="text-gray-700">Date: {new Date(itinerary.date).toLocaleDateString()}</p>
              <button
                className={`btn ${itinerary.flagged ? 'btn-danger' : 'btn-primary'} mt-2`}
                onClick={() => itinerary.flagged ? handleUnflagItinerary(itinerary._id) : handleFlagItinerary(itinerary._id)}
              >
                {itinerary.flagged ? 'Unflag as Inappropriate' : 'Flag as Inappropriate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlagItinerary;