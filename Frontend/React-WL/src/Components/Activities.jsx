import { useState, useEffect } from 'react';
import Activity from './Activity';

const Activities = () => {
  const [activities, setActivities] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          Browse Activites
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Activity key={activity.id} activity={activity} />
            ))
          ) : (
            <p>No activities found</p> // Handle empty activities case
          )}
        </div>
      </div>
    </section>
  );
};

export default Activities;
