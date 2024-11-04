import { useState, useEffect } from 'react';
import Location from './Location'; // Ensure you have this component

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/location/getLocations');
        const data = await res.json();
        setLocations(data);
        setFilteredLocations(data); // Initialize filtered locations with all locations
      } catch (error) {
        console.log('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/preferenceTag/getpreferenceTags');
        const tagsData = await res.json();
        setTags(tagsData);
      } catch (error) {
        console.log('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Handle tag selection
  const handleTagClick = (tagId) => {
    const isSelected = selectedTags.includes(tagId);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // Filter locations when selectedTags changes
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter((location) =>
        location.tags.some((tag) => selectedTags.includes(tag._id))
      );
      setFilteredLocations(filtered);
    }
  }, [selectedTags, locations]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Browse Locations</h2>
        
        {/* Tag Filter */}
        <div className="mb-6 flex justify-center flex-wrap gap-4">
          {tags.map((tag) => (
            <button
              key={tag._id}
              onClick={() => handleTagClick(tag._id)}
              className={`px-4 py-2 border rounded-lg ${
                selectedTags.includes(tag._id) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
