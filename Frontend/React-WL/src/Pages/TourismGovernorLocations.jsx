import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

const TourismGovernorLocations = () => {
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [locationForm, setLocationForm] = useState({
    name: '',
    description: '',
    pictures: '',
    location: '',
    openingHours: '',
    ticketPrices: '',
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
      const response = await fetch('http://localhost:8000/createLocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationForm),
      });
      if (response.ok) {
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
      <h1 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Manage Locations</h1>
      <button
        onClick={() => setLocationFormVisible(!isLocationFormVisible)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Add Location
      </button>
      <button
        onClick={() => setTagFormVisible(!isTagFormVisible)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Create Tag
      </button>

      {isTagFormVisible && (
        <div className="form-container">
          <h2>Add New Tag</h2>
          <form onSubmit={handleSubmitTag}>
            <input type="text" value={tagForm.name} onChange={handleTagChange} placeholder="Tag" required />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Tag
            </button>
          </form>
        </div>
      )}

      {isLocationFormVisible && (
        <div className="form-container">
          
          <form onSubmit={handleSubmitLocation}>
            <input type="text" name="name" value={locationForm.name} onChange={handleAddLocationChange} placeholder="Name" required />
            <input type="text" name="description" value={locationForm.description} onChange={handleAddLocationChange} placeholder="Description" required />
            <input type="text" name="pictures" value={locationForm.pictures} onChange={handleAddLocationChange} placeholder="Picture URL" />
            <input type="text" name="location" value={locationForm.location} onChange={handleAddLocationChange} placeholder="Location (Google Maps URL)" required />
            <input type="text" name="openingHours" value={locationForm.openingHours} onChange={handleAddLocationChange} placeholder="Opening Hours" required />
            <input type="number" name="ticketPrices" value={locationForm.ticketPrices} onChange={handleAddLocationChange} placeholder="Ticket Prices" required />
            <label>Tags (Select Multiple):</label>
            <select multiple value={locationForm.tags} onChange={handleLocationTagsChange}>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>{tag.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Location
            </button>
          </form>
        </div>
      )}

      <div id="LocationContainer">
        {locations.length > 0 ? (
          locations.map((location) => (
            <div key={location._id} className="location" style={{ background: 'white', padding: '15px', margin: '10px 0', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
              <h3>{location.name}</h3>
              <p>{location.description}</p>
              <p>{location.openingHours}</p>
              <p>{location.ticketPrices}</p>
              <div>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleDeleteLocation(location._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleUpdateLocation(location._id)}
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No locations available.</p>
        )}
      </div>

      {isUpdateFormVisible && (
        <div className="update-form-container">
          <h2>Update Location</h2>
          <form onSubmit={handleUpdateSubmit}>
            <input type="text" name="name" value={updateLocation.name} onChange={(e) => setUpdateLocation({ ...updateLocation, name: e.target.value })} required />
            <input type="text" name="description" value={updateLocation.description} onChange={(e) => setUpdateLocation({ ...updateLocation, description: e.target.value })} required />
            <input type="text" name="pictures" value={updateLocation.pictures} onChange={(e) => setUpdateLocation({ ...updateLocation, pictures: e.target.value })} />
            <input type="text" name="location" value={updateLocation.location} onChange={(e) => setUpdateLocation({ ...updateLocation, location: e.target.value })} required />
            <input type="text" name="openingHours" value={updateLocation.openingHours} onChange={(e) => setUpdateLocation({ ...updateLocation, openingHours: e.target.value })} required />
            <input type="number" name="ticketPrices" value={updateLocation.ticketPrices} onChange={(e) => setUpdateLocation({ ...updateLocation, ticketPrices: e.target.value })} required />
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
