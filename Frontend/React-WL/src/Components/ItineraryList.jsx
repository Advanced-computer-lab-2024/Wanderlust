import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import Activities from './Activity';

const Itinerary = () => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [newItinerary, setNewItinerary] = useState({
    title: '',
    timeline: { start: '', end: '' },
    price: '',
    languageOfTour: '',
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
    bookingOpen: false,
    activities: [],
    locations: [],
    availableDates: []
  });

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

  const handleCreate = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
    setNewItinerary({
      title: '',
      timeline: { start: '', end: '' },
      price: '',
      languageOfTour: '',
      accessibility: '',
      pickupLocation: '',
      dropoffLocation: '',
      bookingOpen: false,
      activities: [],
      locations: [],
      availableDates: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'start' || name === 'end') {
      setNewItinerary(prev => ({
        ...prev,
        timeline: { ...prev.timeline, [name]: value }
      }));
    } else {
      setNewItinerary(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim());
    setNewItinerary(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting new itinerary:", newItinerary);
    handleCloseCreateForm();
    await fetchItinerary();
  };

  const handleUpdate = (id) => {
    console.log("Update itinerary with id:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete itinerary with id:", id);
  };

  if (loading) return <p>Loading itinerary...</p>;
  if (error) return <p>Error loading itinerary: {error.message}</p>;

  return (
    <Card>
      <div className="itinerary-container px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">Itineraries</h1>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create New Itinerary
          </button>
        </div>
        {itinerary.length > 0 ? (
          itinerary.map((item) => (
            <ItineraryItem
              key={item._id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No itinerary data available.</p>
        )}
      </div>

      {isCreateFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-8 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-indigo-700">Create New Itinerary</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-8">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newItinerary.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="start"
                    name="start"
                    value={newItinerary.timeline.start}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="end"
                    name="end"
                    value={newItinerary.timeline.end}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newItinerary.price}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="languageOfTour">
                  Language of Tour
                </label>
                <select
                  id="languageOfTour"
                  name="languageOfTour"
                  value={newItinerary.languageOfTour}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accessibility">
                  Accessibility
                </label>
                <input
                  type="text"
                  id="accessibility"
                  name="accessibility"
                  value={newItinerary.accessibility}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pickupLocation">
                  Pickup Location
                </label>
                <input
                  type="text"
                  id="pickupLocation"
                  name="pickupLocation"
                  value={newItinerary.pickupLocation}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropoffLocation">
                  Dropoff Location
                </label>
                <input
                  type="text"
                  id="dropoffLocation"
                  name="dropoffLocation"
                  value={newItinerary.dropoffLocation}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activities">
                  Activities (comma-separated)
                </label>
                <input
                  type="text"
                  id="activities"
                  name="activities"
                  value={newItinerary.activities.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'activities')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="locations">
                  Locations (comma-separated)
                </label>
                <input
                  type="text"
                  id="locations"
                  name="locations"
                  value={newItinerary.locations.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'locations')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availableDates">
                  Available Dates (comma-separated)
                </label>
                <input
                  type="text"
                  id="availableDates"
                  name="availableDates"
                  value={newItinerary.availableDates.join(', ')}
                  onChange={(e) => handleArrayInputChange(e, 'availableDates')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="bookingOpen"
                    checked={newItinerary.bookingOpen}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Booking Open</span>
                </label>
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create Itinerary
                </button>
                <button
                  type="button"
                  onClick={handleCloseCreateForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};

const ItineraryItem = ({ item, onUpdate, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md mb-6 p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-indigo-600">{item.title}</h2>
        <p className="text-gray-600 text-sm">{item.timeline.start} - {item.timeline.end}</p>
      </div>
      <div>
        <button
          onClick={() => onUpdate(item._id)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 rounded-lg mr-2 shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
        >
          Delete
        </button>
      </div>
    </div>
    <ItineraryDetails item={item} />
    <ItineraryActivities activities={item.activities} />
    <ItinerarySection title="Locations" items={item.locations} />
    <ItinerarySection title="Available Dates" items={item.availableDates} />
  </div>
);

const ItineraryDetails = ({ item }) => (
  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
    <DetailItem label="Price" value={item.price} />
    <DetailItem label="Language of Tour" value={item.languageOfTour} />
    <DetailItem label="Accessibility" value={item.accessibility} />
    <DetailItem label="Pickup Location" value={item.pickupLocation} />
    <DetailItem label="Dropoff Location" value={item.dropoffLocation} />
    <DetailItem label="Booking Open" value={item.bookingOpen ? "Yes" : "No"} />
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="ml-2 text-gray-600">{value}</span>
  </div>
);

const ItineraryActivities = ({ activities }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3 text-indigo-500 border-b border-indigo-100 pb-1">Activities</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-gray-50 rounded-lg p-3">
          <Activities activity={activity} />
        </div>
      ))}
    </div>
  </div>
);

const ItinerarySection = ({ title, items }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-indigo-500 border-b border-indigo-100 pb-1">{title}</h3>
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