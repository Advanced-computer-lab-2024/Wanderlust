import React from 'react';

// Function to generate Google Maps embed URL
const getGoogleMapsEmbedUrl = (lat, lng) => {
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyA_eS_8ocAw_f4vgD01n-_vDIXG16QixpI&q=${lat},${lng}`;
};

const Location = ({ location }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Display the name of the location */}
      <h3 className="text-xl font-bold text-indigo-500">{location.name}</h3>
      
      {/* Display the description of the location */}
      <p>{location.description}</p>
      
      {/* Google Maps Embed */}
      <div className="my-2">
        <div className="w-full h-40">
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

      {/* Display the opening hours */}
      <p><strong>Opening Hours:</strong> {location.openingHours}</p>
      
      {/* Display the ticket prices */}
      <p><strong>Ticket Prices:</strong> ${location.ticketPrices}</p>
      
      {/* Display the tags */}
      <div>
        <strong>Tags:</strong>
        <ul className="flex flex-wrap">
          {location.tags && location.tags.length > 0 ? (
            location.tags.map((tag, index) => (
              <li key={index} className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs mr-1 mb-1">
                {tag.name}
              </li>
            ))
          ) : (
            <li>No tags available</li> // Handle cases where there are no tags
          )}
        </ul>
      </div>
    </div>
  );
};

export default Location;
