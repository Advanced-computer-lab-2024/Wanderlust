import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Clock, DollarSign, Tag } from 'lucide-react';


const CreateActivityForm = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
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
    bookingOpen: true,
  });
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    loadGoogleMapsAPI();
  }, []);

  

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/category/getCategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/preferenceTag/getpreferenceTags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const loadGoogleMapsAPI = () => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBjbAAKNhaUHHM7DmvEdWNVJqC2iDQtrG4&callback=initGoogleMaps&libraries=places';
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
        initGoogleMaps();
      };
      document.body.appendChild(script);
    } else {
      setIsGoogleMapsLoaded(true);
      initGoogleMaps();
    }
  };
  const initGoogleMaps = () => {
    if (mapContainerRef.current) {
      const mapOptions = {
        center: { lat: 0, lng: 0 },
        zoom: 8,
      };
      const newMap = new window.google.maps.Map(mapContainerRef.current, mapOptions);
      const newMarker = new window.google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: newMap,
        draggable: true,
      });

 

  

      newMap.addListener('click', (event) => {
        updateMarkerPosition(event.latLng);
      });

      newMarker.addListener('dragend', () => {
        updateMarkerPosition(newMarker.getPosition());
      });

      setMap(newMap);
      setMarker(newMarker);
    }
  };

  const updateMarkerPosition = (latLng) => {
    if (marker) {
      marker.setPosition(latLng);
      setFormData((prevState) => ({
        ...prevState,
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
      map.panTo(latLng);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/activity/createActivity', formData);
      // Reset the form or perform any other necessary actions
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter activity name"
          required
        />
      </div>
      {/* Add more form fields here */}
      <div ref={mapContainerRef} style={{ height: '200px', width: '100%', marginBottom: '1rem' }} />
      <button type="submit">Create Activity</button>
    </form>
  );
};

export default CreateActivityForm;