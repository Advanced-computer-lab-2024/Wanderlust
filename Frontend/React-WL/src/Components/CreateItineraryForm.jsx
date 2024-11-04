import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Globe, DollarSign, Users, Plus, Trash, Check } from 'lucide-react';
import Card from './Card';

const CreateItineraryForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    languageOfTour: '',
    accessibility: '',
    pickupLocation: '',
    dropoffLocation: '',
    timeline: {
      start: '',
      end: ''
    },
    activities: [],
    locations: [],
    availableDates: [],
    bookingOpen: true
  });

  const [availableActivities, setAvailableActivities] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const languages = ['English', 'Spanish', 'French', 'German'];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/activity/getActivity');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const data = await response.json();
      setAvailableActivities(data);
    } catch (err) {
      setError('Failed to load activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => {
      const isAlreadySelected = prev.activities.some(a => a._id === activity._id);
      
      if (isAlreadySelected) {
        return {
          ...prev,
          activities: prev.activities.filter(a => a._id !== activity._id)
        };
      } else {
        return {
          ...prev,
          activities: [...prev.activities, activity]
        };
      }
    });
  };

  const handleAddItem = (type, value, setter) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value]
    }));
    setter('');
    // Clear validation error when items are added
    setValidationErrors(prev => ({
      ...prev,
      [type]: ''
    }));
  };

  const handleRemoveItem = (type, index) => {
    setFormData(prev => {
      const newArray = prev[type].filter((_, i) => i !== index);
      // Set validation error if array becomes empty
      if (newArray.length === 0) {
        setValidationErrors(prevErrors => ({
          ...prevErrors,
          [type]: `At least one ${type.slice(0, -1)} is required`
        }));
      }
      return {
        ...prev,
        [type]: newArray
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (formData.locations.length === 0) {
      errors.locations = 'At least one location is required';
    }
    
    if (formData.availableDates.length === 0) {
      errors.availableDates = 'At least one available date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/itinerary/createitinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create itinerary');
      }
      
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error('Error creating itinerary:', error);
      setError('Failed to create itinerary');
    }
  };

  if (!onClose || !onSubmit) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-start justify-center z-50 overflow-y-auto py-8">
      <div className="relative w-full max-w-4xl mx-4 my-8">
        <Card className="bg-white p-6 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-700">Create New Itinerary</h1>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter itinerary title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xl"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <DollarSign className="text-indigo-500" size={20} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Globe className="text-indigo-500" size={20} />
                <select
                  name="languageOfTour"
                  value={formData.languageOfTour}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                >
                  <option value="">Select Language</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Calendar className="text-indigo-500" size={20} />
                <input
                  type="date"
                  name="timeline.start"
                  value={formData.timeline.start}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Calendar className="text-indigo-500" size={20} />
                <input
                  type="date"
                  name="timeline.end"
                  value={formData.timeline.end}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <MapPin className="text-indigo-500" size={20} />
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Pickup Location"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <MapPin className="text-indigo-500" size={20} />
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  placeholder="Dropoff Location"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

               {/* Activities Section */}
               <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
              <Users className="mr-2" size={20} />
              Activities
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-2">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableActivities.map((activity) => (
                  <div
                    key={activity._id}
                    onClick={() => handleActivityToggle(activity)}
                    className={`
                      flex items-center justify-between p-4 rounded-lg cursor-pointer transition duration-200
                      ${formData.activities.some(a => a._id === activity._id)
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={activity.image || '/placeholder-activity.jpg'}
                          alt={activity.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                    {formData.activities.some(a => a._id === activity._id) && (
                      <Check className="text-indigo-600" size={20} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
            
            {/* Locations Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
                <MapPin className="mr-2" size={20} />
                Locations <span className="text-red-500 ml-1">*</span>
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add a location"
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    validationErrors.locations ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => handleAddItem('locations', newLocation, setNewLocation)}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>
              {validationErrors.locations && (
                <p className="text-red-500 text-sm">{validationErrors.locations}</p>
              )}
              <div className="space-y-2">
                {formData.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">{location}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('locations', index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Dates Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-indigo-500 border-b border-indigo-100 pb-1 flex items-center">
                <Calendar className="mr-2" size={20} />
                Available Dates <span className="text-red-500 ml-1">*</span>
              </h3>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    validationErrors.availableDates ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  type="button"
                  onClick={() => handleAddItem('availableDates', newDate, setNewDate)}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  <Plus size={20} />
                </button>
              </div>
              {validationErrors.availableDates && (
                <p className="text-red-500 text-sm">{validationErrors.availableDates}</p>
              )}
              <div className="space-y-2">
                {formData.availableDates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-700">{date}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('availableDates', index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Create Itinerary
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateItineraryForm;