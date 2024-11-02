import { useState, useEffect } from 'react';
import Activity from './Activity';

const Activities = ({ showCreateButton = true, showUpdateButton = true, showDeleteButton = true, onCreate }) => {
  const [activities, setActivities] = useState([]);
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
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          Browse Activities
        </h2>

        {/* Create Activity Button */}
        {showCreateButton && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onCreate}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Activity
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Activity
                key={activity.id}
                activity={activity}
                showUpdateButton={showUpdateButton} // Set visibility flags based on props
                showDeleteButton={showDeleteButton}
                onUpdate={() => console.log(`Updating activity ${activity.id}`)}
                onDelete={() => console.log(`Deleting activity ${activity.id}`)}
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
