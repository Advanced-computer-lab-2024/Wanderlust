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

## Badges

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![ReactJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## Build Status

![Build Status](https://img.shields.io/badge/status-In%20Development-blue)

- **Current Phase:** Development
- **Upcoming Tasks:**
  - Implement testing using Jest
  - Complete authorization middleware across all routes
  - Organize backend structure for better maintainability
 
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

- ![Home Page](screenshots/Homepage.png)

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
Example of Creating an Itinerary
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
   cd Wanderlust/Backend/server
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
### Product Routes
- `POST /addProduct`: Add a new product
- `PUT /updateProductByName`: Update product by name
- `GET /searchProductByName`: Search product by name
- `GET /filterProductsByPrice`: Filter products by price
- `GET /sortedByRating`: Get products sorted by rating
- `GET /viewAllProducts`: View all products
- `GET /viewAvailableProducts`: View available products
- `DELETE /deleteproduct`: Delete product by name
- `PUT /archiveProduct`: Archive product
- `PUT /unarchiveProduct`: Unarchive product
- `POST /product/rate:` Rate a product
- `GET /product/:productId/details`: View product details
- `POST /product/sale`: Add sale to product
### Activity Routes
- `POST /createActivity`: Create a new activity
- `GET /getActivity`: Get all activities
- `GET /getActivityGuest`: Get activities for guests
- `GET /getActivityById`: Get activity by ID
- `PUT /updateActivity`: Update an activity
- `DELETE /deleteActivity`: Delete an activity
- `GET /filterActivities`: Filter activities
- `GET /sortActivities`: Sort activities
- `GET /searchActivity`: Search activities
- `GET /activities`: Get activities by category name
- `GET /share/:activityId`: Generate shareable link
- `POST /shareMail/`:activityId/email: Send activity link via email
- `POST /rate/:activityId`: Rate an activity
- `POST /bookActivity`: Book an activity
- `POST /paymentSuccess`: Card payment success
- `DELETE /cancelActivityBooking/`:bookingId: Cancel activity booking
- `POST /saveActivity`: Save an activity
- `POST /unsaveActivity`: Unsave an activity
- `GET /savedActivities/:touristId`: Get saved activities
- `POST /requestNotification`: Request notification
- `PUT /activity/:id/flag`: Flag an activity
- `PUT /activity/:id/unflag`: Unflag an activity
### Admin Routes
- `POST /addTourismGovernor`: Add tourism governor
- `DELETE /delete`: Delete account
- `GET /usernames`: Get all user details
- `POST /create`: Create admin
- `GET /pendingUsers`: Get pending users
- `PUT /approvePendingUser/`:userId: Approve pending user
- `GET /profile`: Get admin details
- `GET /userStatistics`: Get user statistics
- `POST /createPromoCode`: Create promo code
- `GET /getNotifications`: Get notifications
- `GET /promoCodes`: Get promo codes
- `POST /login`: Admin login
- `POST /updatepassword`: Update admin password
- `GET /getLoggedInUser`: Get logged-in user
- `GET /getLoggedInInfo`: Get logged-in info
- `POST /acceptTerms`: Accept terms
- `GET /requestDeleteAccount`: Request to delete account

## Tests

Currently, testing is performed manually using Postman for API endpoints. Automated testing is planned to be implemented using Jest.

### Manual Testing with Postman

- **Example 1: Admin Login**
  - **Endpoint:** `http://localhost:8000/api/admin/login`
  - **Method:** POST
  - **Body:**
    ```json
    {
      "username": "nada",
      "password": "nada123",
      "role": "admin"
    }
    ```

- **Example 2: Rate Itinerary**
  - **Endpoint:** `http://localhost:3000/api/itinerary/rate`
  - **Method:** POST
  - **Body:**
    ```json
    {
      "itineraryId": "60d5f9b8f8d2c9b8f8d2c9b8",
      "rating": 5,
      "review": "Amazing tour! Highly recommend."
    }
    ```

### Future Testing Plans

- Implement unit and integration tests using Jest and Supertest.

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

## Authors

- Amgad Tahoun
- Nada Tamer
- Yousef Abdelhamid
- Khaled Essam
- Khaled Mostafa
- Amr Hesham
- Amr Khaled
- Ali Mousa
- Shahd Hesham
- Shahd Elfeky

## Contribute

We welcome contributions to Wanderlust! Follow the steps below to contribute:

1. **Fork the repository.**

2. **Clone your forked repository to your local machine:**
   ```bash
   git clone https://github.com/your-username/Wanderlust.git
   cd Wanderlust
   ```
3. **Create a new branch for your feature or bug fix.**
  ```bash
  git checkout -b feature/your-feature-name
  ```
4. **Make your changes and commit them with clear and descriptive messages.**
  ```bash
  git commit -m "Add feature: your feature name"
  ```
5.**Push your changes to your forked repository.**
  ```bash
  git push origin feature/your-feature-name
  ```
6. **Open a pull request in the original repository, describing the changes and linking to any relevant issues.**
   
## Credits

Wanderlust leverages various third-party services and libraries to enhance functionality:

- [Lucid React](https://lucide.dev/guide/packages/lucide-react) - Icon library for React.

- [Material UI](https://mui.com) - React UI framework for building responsive interfaces.

- [UiVerse](https://uiverse.io) - Design resources and UI components.

- [NodeMailer](https://www.nodemailer.com) - Module for sending emails from Node.js.

- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/) - Cloud database service.

- [Stripe Web Elements](https://stripe.com/docs/payments/elements) - Payment processing integration.

## License

- [App Exchange](app.exchangerate-api.com)

- [Amadeus](https://amadeus.com/en)

- [Stripe](https://stripe.com)

- [Cloudinary](https://cloudinary.com)

This project is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

---
