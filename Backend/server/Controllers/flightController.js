// controllers/flightController.js
const axios = require('axios'); 

const API_KEY = process.env.FLIGHT_API_KEY; // Ensure your API key is stored in the .env file
const API_URL = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=JFK&arr_iata=LHR`; // Replace with actual endpoint

const getFlightData = async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching flight data" });
    }
};

module.exports = { getFlightData };
