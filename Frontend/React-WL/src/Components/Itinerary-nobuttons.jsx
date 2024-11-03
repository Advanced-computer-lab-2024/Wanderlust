import React, { useEffect, useState } from 'react';
import Card from './Card';
import Activities from './Activity';
import { Calendar, MapPin, Globe, DollarSign, Users, Check } from 'lucide-react';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/itinerary/getitinerary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setItinerary(data);
      } else {
        console.log("Itinerary array is empty or undefined.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card>
          <div className="itinerary-container">
            <h1 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Browse Itineraries</h1>
            {itinerary.length > 0 ? (
              itinerary.map((item) => (
                <ItineraryItem key={item._id} item={item} />
              ))
            ) : (
              <div className="text-center py-8">
                <Globe className="mx-auto text-gray-400" size={64} />
                <p className="mt-4 text-xl text-gray-600">No itineraries available. Create your first adventure!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ItineraryItem = ({ item }) => (
  <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2 text-indigo-600">{item.title}</h2>
        <p className="text-gray-600 text-sm flex items-center">
          <Calendar className="mr-2" size={16} />
          {item.timeline.start} - {item.timeline.end}
        </p>
      </div>
      <ItineraryDetails item={item} />
      <ItineraryActivities activities={item.activities} />
      <ItinerarySection title="Locations" items={item.locations} icon={<MapPin size={18} />} />
      <ItinerarySection title="Available Dates" items={item.availableDates} icon={<Calendar size={18} />} />
    </div>
  </div>
);

const ItineraryDetails = ({ item }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
    <DetailItem icon={<DollarSign size={18} />} label="Price" value={item.price} />
    <DetailItem icon={<Globe size={18} />} label="Language of Tour" value={item.languageOfTour} />
    <DetailItem icon={<Users size={18} />} label="Accessibility" value={item.accessibility} />
    <DetailItem icon={<MapPin size={18} />} label="Pickup Location" value={item.pickupLocation} />
    <DetailItem icon={<MapPin size={18} />} label="Dropoff Location" value={item.dropoffLocation} />
    <DetailItem icon={<Check size={18} />} label="Booking Open" value={item.bookingOpen ? "Yes" : "No"} />
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="text-indigo-500 mr-2">{icon}</div>
    <div>
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-600">{value}</span>
    </div>
  </div>
);

const ItineraryActivities = ({ activities }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
      <Users className="mr-2" size={20} />
      Activities
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition duration-300">
          <Activities activity={activity} />
        </div>
      ))}
    </div>
  </div>
);

const ItinerarySection = ({ title, items, icon }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <ul className="list-disc list-inside pl-4">
      {items.map((item, index) => (
        <li key={index} className="text-gray-600 text-sm mb-1">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Itinerary;