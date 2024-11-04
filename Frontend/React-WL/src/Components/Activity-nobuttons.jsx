import React from 'react';

const Activity = ({ activity }) => {
  // Function to generate Google Maps embed URL
  const getGoogleMapsEmbedUrl = (lat, lng) => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA_eS_8ocAw_f4vgD01n-_vDIXG16QixpI&q=${lat},${lng}`;
  };

  // Function to check if special discounts are available
  const hasSpecialDiscounts = (discounts) => {
    return discounts && discounts !== "undefined" && discounts.trim() !== "";
  };

  return (
    <div className="bg-white rounded-xl shadow-md relative">
      <div className="p-3">
        <div className="mb-2">
          <div className="text-gray-600 text-xs">{activity.category?.name || 'N/A'}</div>
          <h3 className="text-lg font-bold leading-tight">{activity.name}</h3>
          <p className="text-gray-500 text-xs">
            {new Date(activity.date).toLocaleDateString()} {activity.time}
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="mb-2">
          <div className="w-full h-40">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={getGoogleMapsEmbedUrl(activity.lat, activity.lng)}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-gray-600 text-xs">
            {hasSpecialDiscounts(activity.specialDiscounts) ? activity.specialDiscounts : "No Special Discounts"}
          </span>
        </div>

        <h3 className="text-indigo-500 text-base font-semibold mb-1">${activity.price}</h3>
        <p className="text-gray-500 text-xs">Duration: {activity.duration}</p>
        <p className="text-gray-500 text-xs">Rating: {activity.rating ? activity.rating : 'Not Rated'}</p>
        <p className="text-gray-500 text-xs">
          <strong>Booking Open: {activity.bookingOpen ? 'Yes' : 'No'}</strong>
        </p>

        <div className="mt-1">
          <h4 className="font-semibold text-xs">Tags:</h4>
          <div className="flex flex-wrap">
            {activity.tags && activity.tags.length > 0 ? (
              activity.tags.map((tag) => (
                <span key={tag._id} className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">No Tags</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
