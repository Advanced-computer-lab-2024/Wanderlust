import { useState, useEffect } from 'react';
import Location from './Location'; // Ensure you have this component

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch locations and derive tags
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/location/getLocations');
        const data = await res.json();
        setLocations(data);
        setFilteredLocations(data);

        // Extract unique tags from locations
        const uniqueTags = [];
        data.forEach((location) => {
          location.tags.forEach((tag) => {
            if (!uniqueTags.some((t) => t._id === tag._id)) {
              uniqueTags.push(tag);
            }
          });
        });
        setTags(uniqueTags);
      } catch (error) {
        console.log('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on selected filters
  useEffect(() => {
    let filtered = locations;

    if (selectedTag) {
      filtered = filtered.filter((location) =>
        location.tags.some((tag) => tag._id === selectedTag)
      );
    }

    // Filter based on min and max price
    if (minPrice || maxPrice) {
      filtered = filtered.filter((location) => {
        const price = location.price;
        return (
          (minPrice ? price >= minPrice : true) &&
          (maxPrice ? price <= maxPrice : true)
        );
      });
    }

    // Filter based on rating
    if (selectedRating) {
      filtered = filtered.filter((location) => location.rating >= selectedRating);
    }

    setFilteredLocations(filtered);
  }, [selectedTag, minPrice, maxPrice, selectedRating, locations]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <section className="bg-gray-50 px-4 py-10">
      <div className="container-xl lg:container mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Browse Locations</h2>
        
        {/* Filter Section */}
        <div className="flex justify-between mb-8">
          <div className="flex items-center space-x-6">
            {/* Tag Filter (Dropdown) */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <select
                id="tags"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag._id} value={tag._id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter (Custom Min and Max Inputs) */}
            <div className="flex space-x-4">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  id="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Min Price"
                />
              </div>

              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  id="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Max Price"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <Location key={location._id} location={location} />
            ))
          ) : (
            <p>No locations found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Locations;
