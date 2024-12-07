import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, DollarSign, Tag, Calendar } from 'lucide-react';
import Card from './Card';

// export default CreateActivityForm;


const CreateActivityForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    lat: 0,
    lng: 0,
    price: '',
    duration: '',
    category: '',
    tags: [],
    specialDiscounts: '',
    bookingOpen: true,
  });


  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchTags();
    
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/category/getCategories');
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/preferenceTag/getpreferenceTags');
      setTags(response.data);
    } catch (error) {
      setError('Error fetching tags');
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTagSelection = (e) => {
    const { options } = e.target;
    const selectedTags = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData((prevState) => ({
      ...prevState,
      tags: selectedTags,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.lat) errors.lat = 'Latitude is required';
    if (!formData.lng) errors.lng = 'Longitude is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.duration) errors.duration = 'Duration is required';
    if (!formData.category) errors.category = 'Category is required';
    if (formData.tags.length === 0) errors.tags = 'At least one tag is required';
    if (!formData.specialDiscounts) errors.specialDiscounts = 'Special discounts are required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post('/api/activity/createActivity', formData);
      onSubmit?.();
      onClose?.();
    } catch (error) {
      console.error('Error creating activity:', error);
      setError('Failed to create activity');
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
              <h1 className="text-4xl font-bold text-custom">Create New Activity</h1>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter activity name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom text-xl"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                  <Calendar className="text-custom" size={20} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                  <Clock className="text-custom" size={20} />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                  <MapPin className="text-custom" size={20} />
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    placeholder="Enter latitude"
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                  <MapPin className="text-custom" size={20} />
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    placeholder="Enter longitude"
                    className="flex-1 bg-transparent border-none focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              

              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <DollarSign className="text-custom" size={20} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Clock className="text-custom" size={20} />
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Enter duration"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Tag className="text-custom" size={20} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <Tag className="text-custom" size={20} />
                <select
                  name="tags"
                  multiple
                  value={formData.tags}
                  onChange={handleTagSelection}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                >
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-4">
                <DollarSign className="text-custom" size={20} />
                <input
                  type="text"
                  name="specialDiscounts"
                  value={formData.specialDiscounts}
                  onChange={handleInputChange}
                  placeholder="Enter special discounts"
                  className="flex-1 bg-transparent border-none focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-custom" size={20} />
                  <span className="text-gray-700">Booking Open</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="bookingOpen"
                    checked={formData.bookingOpen}
                    onChange={(e) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        bookingOpen: e.target.checked,
                      }))
                    }
                    className="h-6 w-6 text-custom border-gray-300 rounded focus:ring-custom"
                  />
                  <span className={`text-sm ${formData.bookingOpen ? 'text-custom' : 'text-gray-500'}`}>
                    {formData.bookingOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

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
                className="px-6 py-2 bg-custom text-white rounded-lg hover:bg-custom transition duration-300"
              >
                Create Activity
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateActivityForm;