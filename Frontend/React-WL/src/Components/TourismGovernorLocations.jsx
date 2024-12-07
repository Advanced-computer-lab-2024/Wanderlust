import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const TourismGovernorLocations = () => {
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [locationForm, setLocationForm] = useState({
    name: '',
    description: '',
    pictures: '',
    location: '',
    openingHours: '',
    ticketPricesNatives: '',
    ticketPricesForeigners: '',
    ticketPricesStudents: '',
    tags: [],
  });
  const [tagForm, setTagForm] = useState({ name: '' });
  const [isLocationFormVisible, setLocationFormVisible] = useState(false);
  const [isTagFormVisible, setTagFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [updateLocation, setUpdateLocation] = useState({});

  useEffect(() => {
    fetchLocations();
    fetchTags();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8000/getLocations');
      const data = await response.json();
      if (response.ok) {
        setLocations(data);
      } else {
        console.error('Failed to fetch locations.');
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/preferenceTag/getpreferenceTags');
      const tagsData = await response.json();
      if (response.ok) {
        setTags(tagsData);
      } else {
        console.error('No tags found or failed to fetch.');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleAddLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    setTagForm({ name: value });
  };

  const handleLocationTagsChange = (e) => {
    const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
    setLocationForm((prev) => ({ ...prev, tags: selectedTags }));
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/createLocation', locationForm, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
      });
      if (response.status === 201) {
        alert('Location added successfully!');
        setLocationForm({ name: '', description: '', pictures: '', location: '', openingHours: '', ticketPrices: '', tags: [] });
        setLocationFormVisible(false);
        fetchLocations();
      } else {
        alert('Failed to add location.');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Error adding location.');
    }
  };

  const handleSubmitTag = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/preferenceTag/createTag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagForm),
      });
      if (response.ok) {
        alert('Tag added successfully!');
        setTagForm({ name: '' });
        setTagFormVisible(false);
        fetchTags();
      } else {
        alert('Failed to add tag.');
      }
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Error adding tag.');
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/deleteLocation/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLocations();
      } else {
        console.error('Error deleting location.');
        alert('Failed to delete location.');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location.');
    }
  };

  const handleUpdateLocation = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/getLocation/${id}`);
      const location = await response.json();
      if (response.ok) {
        setUpdateLocation(location);
        setUpdateFormVisible(true);
      } else {
        alert('Failed to fetch location data.');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      alert('Error fetching location data.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const id = updateLocation._id;
    try {
      const response = await fetch(`http://localhost:8000/updateLocation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateLocation),
      });
      if (response.ok) {
        alert('Location updated successfully!');
        fetchLocations();
        setUpdateFormVisible(false);
      } else {
        alert('Failed to update location.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Error updating location.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <h1 className="text-3xl font-bold text-custom mb-6 text-center">Manage Historical Places</h1>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setLocationFormVisible(!isLocationFormVisible)}
          className="bg-custom hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Historical Place
        </button>
        <button
          onClick={() => setTagFormVisible(!isTagFormVisible)}
          className="bg-custom hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Tag
        </button>
      </div>

      {isTagFormVisible && (
        <div className="form-container bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-custom text-2xl font-bold mb-4">Add New Tag</h2>
          <form onSubmit={handleSubmitTag}>
            <input
              type="text"
              value={tagForm.name}
              onChange={handleTagChange}
              placeholder="Tag"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <button
              type="submit"
              className="bg-custom hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Tag
            </button>
          </form>
        </div>
      )}

      {isLocationFormVisible && (
        <div className="form-container bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className=" text-custom text-2xl font-bold mb-4">Add New Historical Place</h2>
          <form onSubmit={handleSubmitLocation}>
            <input
              type="text"
              name="name"
              value={locationForm.name}
              onChange={handleAddLocationChange}
              placeholder="Name"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="description"
              value={locationForm.description}
              onChange={handleAddLocationChange}
              placeholder="Description"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="pictures"
              value={locationForm.pictures}
              onChange={handleAddLocationChange}
              placeholder="Picture URL"
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="location"
              value={locationForm.location}
              onChange={handleAddLocationChange}
              placeholder="Location (Google Maps URL)"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="openingHours"
              value={locationForm.openingHours}
              onChange={handleAddLocationChange}
              placeholder="Opening Hours"
              required
              className="border p-2 mb-4 w-full rounded"
            />

            <input
              type="number"
              name="ticketPricesNatives"
              value={locationForm.ticketPricesNatives}
              onChange={handleAddLocationChange}
              placeholder="Ticket Prices for Natives"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="number"
              name="ticketPricesForeigners"
              value={locationForm.ticketPricesForeigners}
              onChange={handleAddLocationChange}
              placeholder="Ticket Prices for Foreigners"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="number"
              name="ticketPricesStudents"
              value={locationForm.ticketPricesStudents}
              onChange={handleAddLocationChange}
              placeholder="Ticket Prices for Students"
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <label className="block mb-2">Tags (Select Multiple):</label>
            <select
              multiple
              value={locationForm.tags}
              onChange={handleLocationTagsChange}
              className="border p-2 mb-4 w-full rounded"
            >
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-custom hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Historical Place
            </button>
          </form>
        </div>
      )}

      <div id="LocationContainer">
        {locations.length > 0 ? (
          locations.map((location) => (
            <div
              key={location._id}
              className="location bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <h3 className="text-xl font-bold mb-2">{location.name}</h3>
              <p className="mb-2">{location.description}</p>
              <p className="mb-2">{location.openingHours}</p>
              <p className="mb-2">{location.ticketPrices}</p>
              <div className="flex space-x-4">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleDeleteLocation(location._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleUpdateLocation(location._id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No locations available.</p>
        )}
      </div>

      {isUpdateFormVisible && (
        <div className="update-form-container bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Update Location</h2>
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="name"
              value={updateLocation.name}
              onChange={(e) => setUpdateLocation({ ...updateLocation, name: e.target.value })}
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="description"
              value={updateLocation.description}
              onChange={(e) => setUpdateLocation({ ...updateLocation, description: e.target.value })}
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="pictures"
              value={updateLocation.pictures}
              onChange={(e) => setUpdateLocation({ ...updateLocation, pictures: e.target.value })}
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="location"
              value={updateLocation.location}
              onChange={(e) => setUpdateLocation({ ...updateLocation, location: e.target.value })}
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="text"
              name="openingHours"
              value={updateLocation.openingHours}
              onChange={(e) => setUpdateLocation({ ...updateLocation, openingHours: e.target.value })}
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <input
              type="number"
              name="ticketPrices"
              value={updateLocation.ticketPrices}
              onChange={(e) => setUpdateLocation({ ...updateLocation, ticketPrices: e.target.value })}
              required
              className="border p-2 mb-4 w-full rounded"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Update Location
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TourismGovernorLocations;
