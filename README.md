# Wanderlust

## Motivation
This project aims to provide a comprehensive platform for travelers and tourists to discover and explore various locations, activities, and services.

## Build Status
Currently, the project is in the development phase. If there are any issues or problems, they will be documented here.

## Code Style
The project follows standard JavaScript and Node.js coding conventions.

## Screenshots


## Tech/Framework used
- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React (with Vite for setup)

## Features
- User Authentication and Authorization
- Location and Activity Management
- Advertiser and Seller Management
- Preference Tagging System
- Itinerary Planning

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

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Wanderlust.git
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd Backend
   npm install
   cd ../Frontend
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
### Location Routes
- `POST /createLocation`: Create a new location
- `GET /getLocations`: Get all locations
- `PUT /updateLocation/:id`: Update a location by ID
- `DELETE /deleteLocation/:id`: Delete a location by ID
- `GET /getLocation/:id`: Get a location by ID

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
