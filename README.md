# Wanderlust

## Motivation
Traveling and exploring new places can be both exciting and overwhelming. The plethora of options available for destinations, activities, accommodations, and services can make planning a trip daunting. Wanderlust aims to solve this by providing a comprehensive platform that centralizes all travel-related information. Our goal is to empower travelers to make informed decisions by offering:

- A user-friendly interface to discover and explore various locations.
- Detailed information on activities, attractions, and services available at each destination.
- A robust itinerary planning tool to help users organize their trips efficiently.
- Personalized recommendations based on user preferences and past activities.
- Features for both travelers and service providers, such as user authentication, location and activity management, and advertiser and seller management.
- An integrated preference tagging system to enhance the user experience by offering tailored suggestions.

By integrating these features, Wanderlust aspires to be the go-to platform for all travel enthusiasts, making travel planning seamless, enjoyable, and personalized.

## Build Status
Currently, the project is in the development phase. If there are any issues or problems, they will be documented here.

## Code Style
Our project adheres to a set of coding standards to ensure consistency, readability, and maintainability across the codebase. Please follow these guidelines when contributing:

### General Guidelines
- **Indentation**: Use 2 spaces for indentation.
- **File Naming**: Use `camelCase` for JavaScript files.
- **Comments**: Use comments to explain the purpose of the code, not the implementation.

### JavaScript
- **Variables**: Use `const` for variables that do not change and `let` for variables that might change.
- **Functions**: Use arrow functions (`() => {}`) for anonymous functions and method definitions inside classes.
- **Semicolons**: Always use semicolons at the end of statements.
- **Quotes**: Use single quotes for strings, except to avoid escaping.

### Node.js
- **Modules**: Use ES6 module syntax (`import` and `export`) instead of CommonJS (`require` and `module.exports`).
- **Error Handling**: Always handle errors gracefully using `try...catch` blocks or error-handling middleware in Express.js.

### HTML
- **Structure**: Use semantic HTML5 elements (`<header>`, `<nav>`, `<section>`, `<footer>`, etc.).
- **Attributes**: Use double quotes for attribute values.

### CSS
- **Selectors**: Use class selectors over ID selectors for styling. Avoid using element selectors.
- **Naming Convention**: Follow the BEM (Block Element Modifier) methodology for naming classes.
- **Properties Ordering**: Group related properties together (e.g., positioning, box model, typography).

By adhering to these coding standards, we ensure that our codebase remains clean, efficient, and easy to understand for all contributors.

## Screenshots


## Tech/Framework Used
Our project leverages a modern tech stack to deliver a seamless and efficient experience for users. The following technologies and frameworks are used:

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building fast and scalable server-side applications.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications.
- **MongoDB**: A NoSQL database that uses a flexible, JSON-like document structure, making it easy to store and query data.

### Frontend
- **React**: A JavaScript library for building user interfaces, maintained by Facebook and a community of developers. It allows for the creation of reusable UI components.
- **Vite**: A build tool that provides a faster and leaner development experience for modern web projects. It is used for setting up and developing the React frontend.
- **HTML**: The standard markup language for documents designed to be displayed in a web browser.
- **CSS**: A style sheet language used for describing the presentation of a document written in HTML.

## Features
- **User Authentication and Authorization**: Implemented using JWT tokens.
- **Location and Activity Management**: CRUD operations for locations and activities.
- **Advertiser and Seller Management**: Management of advertisers and sellers within the platform.
- **Preference Tagging System**: Users can filter itineraries based on their preferences.
- **Itinerary Planning**: Users can create, update, delete, and share itineraries. Itinerary ratings and reviews are also supported.
- **Promo Codes and Discounts**: Handling of promo codes and birthday promotions for tourists.
- **Booking Management**: Booking and cancellation of itineraries, with payment processing.
- **Notification System**: Sends notifications and emails for events like birthdays and bookings.
- **Guided Tours**: A step-by-step guide for users using `intro.js`.
- **Filter and Search**: Users can filter itineraries by date, budget, language, and preferences.
- **Interactive Maps**: Integration with Google Maps API for location-based services.
- **Responsive Design**: Frontend built with React and Vite, ensuring responsive design for various devices.

## Code Examples
Example of initializing the Express server and connecting to MongoDB:
```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || "8000";
const MongoURI = process.env.MONGO_URI;
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
```
Example of Creating an Itenrary
```javascript
const createItinerary = async (req, res) => {
  const {
    title,
    activities,
    locations,
    timeline,
    languageOfTour,
    price,
    rating,
    availableDates,
    accessibility,
    pickupLocation,
    dropoffLocation,
    isActive,
  } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const creatorId = decodedToken.id;
    const itinerary = await Itinerary.create({
      title,
      activities,
      locations,
      timeline,
      languageOfTour,
      price,
      rating,
      availableDates,
      accessibility,
      pickupLocation,
      dropoffLocation,
      isActive,
      creator: creatorId,
    });
    const populatedItenary = await Itinerary.findById(itinerary._id).populate(
      "activities"
    );
    res.status(200).json(populatedItenary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```
Fetching Promo Codes in React
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePromocode = () => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/promoCodes');
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const handleCreatePromoCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/admin/createPromoCode', { code, discount });
      if (response.status === 201) {
        fetchPromoCodes(); // Refresh the list of promo codes
        setCode('');
        setDiscount('');
      }
    } catch (error) {
      console.error('Error creating promo code:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create Promo Code</h1>
      <form onSubmit={handleCreatePromoCode}>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">Promo Code</label>
          <input
            type="text"
            className="form-control"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="discount" className="form-label">Discount (%)</label>
          <input
            type="number"
            className="form-control"
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Promo Code</button>
      </form>

      <h2 className="mt-4">Existing Promo Codes</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Discount</th>
            <th scope="col">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {promoCodes.map((promoCode) => (
            <tr key={promoCode._id}>
              <td>{promoCode.code}</td>
              <td>{promoCode.discount}%</td>
              <td>{new Date(promoCode.expiryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreatePromocode;
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Wanderlust.git
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd Backend
   cd server
   npm install
   cd ../frontend/react-wl/src
   npm install
   ```
3. Create a `.env` file in the backend directory and add your MongoDB URI:
   ```
   MONGO_URI=your_mongodb_uri
   FLIGHT_API_KEY=ed8a7354aa4175d87801e50dfd692947

   ```

## API References
### User Routes
- `POST /signup`: User signup
- `POST /login`: User login
### Location Routes
- `POST /createLocation`: Create a new location
- `GET /getLocations`: Get all locations
- `PUT /updateLocation/:id`: Update a location by ID
- `DELETE /deleteLocation/:id`: Delete a location by ID
- `GET /getLocation/:id`: Get a location by ID
### Tourist Routes
- `GET /getTourist` : Get tourist details
- `POST /createTourist/`:userId: Create a tourist
- `PUT /updateTourist/`:username: Update tourist details
- `GET /viewAll`: View all tourists
- `PUT /redeemPoints/`:username: Redeem points
- `PUT /addProductToWishlist/`:productId: Add product to wishlist
- `GET /getWishlist`: Get wishlist
- `DELETE /removeProductFromWishlist/`:productId: Remove product from wishlist
- `PUT /addProductToCart/`:productId: Add product to cart
- `DELETE /removeFromCart/`:productId: Remove product from cart
- `PUT /cart/changeQuantity/`:productId: Change cart item quantity
- `POST /cart/checkout`: Checkout order
- `POST /cart/paymentSuccess`: Card payment success
- `GET /viewAllOrders`: View all orders
- `GET /viewOrder/:orderId`: View order details
- `DELETE /cancelOrder/:touristId/`:orderId: Cancel order
- `POST /addDeliveryAddress`: Add delivery address
- `DELETE /removeDeliveryAddress/:addressId`: Remove delivery address
- `PUT /updateDeliveryAddress/:addressId`: Update delivery address
- `GET /deliveryAddresses`: Get delivery addresses
- `POST /usePromoCode/:touristId`: Use promo code
- `POST /receiveBirthdayPromo/:touristId`: Receive birthday promo
- `POST /createSystemNotification`: Create system notification

## Tests
Testing is done using Postman for manual API testing.

## How to Use
1. Start the backend server:
   ```bash
   cd Backend
   cd server
   nodemon app
   ```
2. Start the frontend server:
   ```bash
   cd ../frontend/react-wl/src
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:8000` for the backend and `http://localhost:3000` for the frontend.

## Contribute

## Credits

## License


---
