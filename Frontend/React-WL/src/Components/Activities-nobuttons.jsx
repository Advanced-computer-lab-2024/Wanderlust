import { useState, useEffect } from 'react';
import Activity from './Activity-nobuttons';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minBudget: '',
    maxBudget: '',
    date: '',
    category: '',
    ratings: '',
  });
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/activity/getActivity');
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/activity/searchActivity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { query }
      });
      const filteredActivities = await res.json();
      setActivities(filteredActivities);
    } catch (error) {
      console.error('Error searching activities:', error);
    }
  };

  const applyFilters = async () => {
    try {
      const queryString = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:8000/api/activity/filterActivities?${queryString}`);
      const filteredActivities = await res.json();
      setActivities(filteredActivities);
    } catch (error) {
      console.error('Error filtering activities:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          Browse Activities
        </h2>

        <div className="mb-4">
          <input
            type="text"
            name="query"
            placeholder="Search activities"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded p-2"
          />
          <button onClick={handleSearch} className="ml-2 p-2 bg-indigo-500 text-white rounded">
            Search
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold">Filter Activities</h3>
          <input
            type="number"
            name="minBudget"
            placeholder="Min Budget"
            value={filters.minBudget}
            onChange={handleFilterChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="number"
            name="maxBudget"
            placeholder="Max Budget"
            value={filters.maxBudget}
            onChange={handleFilterChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border rounded p-2 mr-2"
          />
          <input
            type="number"
            name="ratings"
            placeholder="Ratings"
            value={filters.ratings}
            onChange={handleFilterChange}
            className="border rounded p-2 mr-2"
          />
          <button onClick={applyFilters} className="p-2 bg-indigo-500 text-white rounded">
            Apply Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Activity
                key={activity._id}
                activity={activity}
              />
            ))
          ) : (
            <p>No activities found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Activities;
