import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Card from '../Components/Card';
import Activities from './Activity';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch itinerary data from the API
    fetch('http://localhost:8000/api/itinerary/getitinerary')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data);
        if (Array.isArray(data) && data.length > 0) {
          setItinerary(data);
        } else {
          console.log("Itinerary array is empty or undefined.");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading itinerary...</p>;
  }

  if (error) {
    return <p>Error loading itinerary: {error.message}</p>;
  }

  return (
    <>
     
      <Card>
      <div className="itinerary-container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Itineraries</h1>
        {itinerary.length > 0 ? (
          itinerary.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md mb-6 p-4">
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <p className="text-gray-500 text-xs">
                Start Date: {item.timeline.start} <br />
                End Date: {item.timeline.end}<br />
                Price:{item.price}<br />
                Language Of Tour: {item.languageOfTour}<br />
              </p>

              <h3 className="text-xl font-semibold mt-4">Activities:</h3>
              <ul className="list-disc list-inside">
                {item.activities.map((activity, index) => (
                  <Activities key = {activity.id} activity={activity} ></Activities>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mt-4">Locations:</h3>
              <ul className="list-disc list-inside">
                {item.locations.map((location, index) => (
                  <li key={index} className="text-gray-500 text-sm">{location}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mt-4">Available Dates:</h3>
              <ul className="list-disc list-inside">
                {item.availableDates.map((availableDates, index) => (
                  <li key={index} className="text-gray-500 text-sm">{availableDates}</li>
                ))}
              </ul>

              <p className="text-gray-500 text-xs">
                <strong>Accessibility:</strong> {item.accessibility} <br />
                <strong>Pickup Location:</strong> {item.pickupLocation}<br />
                <strong>Dropoff Location:</strong> {item.dropoffLocation}<br />
                <strong>bookingOpen:</strong> {item.bookingOpen? "Yes" : "No"}<br />
              </p>

            
       
            </div>
          ))
        ) : (
          <p>No itinerary data available.</p>
        )}
      </div>
      </Card>
    </>
  );
};

export default Itinerary;