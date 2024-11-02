import { useState, useEffect } from 'react';
import Location from './Location'; // Make sure to have a Location component

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/location/getLocations'); 
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.log('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []); // Only runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">Browse Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.length > 0 ? (
            locations.map((location) => (
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
