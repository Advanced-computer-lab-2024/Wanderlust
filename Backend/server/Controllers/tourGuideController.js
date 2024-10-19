// #Task route solution
const tourGuideModel = require('../Models/tourGuide.js');
const { default: mongoose, get } = require('mongoose');

const createTourGuide = async (req, res) => {
  const { username, email, password,  YOE, mobileNumber, previousWork, termsAccepted  } = req.body;

   if (!username || !email || !password || termsAccepted === undefined) {
      return res.status(400).json({ error: 'Username, email, password, and terms acceptance are required' });
   }
  try {
      // Check if the username already exists
      const existingTourGuide = await tourGuideModel.findOne({ username });
      if (existingTourGuide) {
          return res.status(400).json({ error: 'Username already exists' });
      }
      // Create new tour guide
      const tourguide = await tourGuideModel.create({ username, email,password,YOE, mobileNumber, previousWork, termsAccepted, role:"tour guide" 
        });
      res.status(200).json(tourguide);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};






module.exports = {createTourGuide};
