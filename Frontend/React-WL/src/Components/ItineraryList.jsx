import React, { useState, useEffect } from 'react';

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/getitinerary');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        setItineraries(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading itineraries...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (itineraries.length === 0) {
    return <div className="text-center py-10">No itineraries found.</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          Browse Itineraries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} className="bg-white rounded-xl shadow-md relative">
              <div className="p-4">
                <div className="mb-6">
                  <div className="text-gray-600 my-2">
                    {formatDate(itinerary.timeline.start)} - {formatDate(itinerary.timeline.end)}
                  </div>
                  <h3 className="text-xl font-bold">{itinerary.title}</h3>
                </div>

                <div className="mb-5">
                  <p>Locations: {itinerary.locations.join(', ')}</p>
                  <p>Language: {itinerary.languageOfTour}</p>
                  <p>Price: ${itinerary.price}</p>
                </div>

                <div className="border border-gray-100 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4">
                  <div className="text-orange-700 mb-3">
                    <i className="fa-solid fa-location-dot text-lg"></i>
                    {itinerary.pickupLocation}
                  </div>
                  <a
                    href={`/itinerary/${itinerary._id}`}
                    className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItineraryList;