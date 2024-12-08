import React from 'react';

// Function to generate Google Maps embed URL
const getGoogleMapsEmbedUrl = (lat, lng) => {
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA_eS_8ocAw_f4vgD01n-_vDIXG16QixpI&q=${lat},${lng}`;
};

const Location = ({ location }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Display the name of the location */}
      <h3 className="text-3xl font-semibold text-custom mb-4">{location.name}</h3>
      
      {/* Display the description of the location */}
      <p className="text-gray-700 text-lg mb-6">{location.description}</p>

      {/* Google Maps Embed */}
      <div className="my-6 rounded-lg overflow-hidden shadow-md">
        <div className="w-full h-64">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={getGoogleMapsEmbedUrl(location.lat, location.lng)}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Form Section - Using Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Display the opening hours */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-800 mb-2">Opening Hours</label>
          <input
            type="text"
            value={location.openingHours}
            readOnly
            className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Display the ticket prices */}
        <div className="flex flex-col">
          <label className="text-lg font-medium text-gray-800 mb-2">Ticket Prices</label>
          <input
            type="number"
            value={location.ticketPrices}
            readOnly
            className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* Display the tags in a grid */}
        <div className="flex flex-col sm:col-span-2">
          <label className="text-lg font-medium text-gray-800 mb-2">Tags</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {location.tags && location.tags.length > 0 ? (
              location.tags.map((tag, index) => (
                <div key={index} className="bg-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm text-center">
                  {tag.name}
                </div>
              ))
            ) : (
              <div className="text-gray-500 col-span-2">No tags available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
