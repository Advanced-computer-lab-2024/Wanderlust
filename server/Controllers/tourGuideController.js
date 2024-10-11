// #Task route solution
const tourGuideModel = require('../Models/tourGuide.js');
const { default: mongoose, get } = require('mongoose');

const createTourGuide = async (req, res) => {
  const { username, email, password, YOE, mobileNumber, previousWork, termsAccepted } = req.body;

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
      const tourguide = await tourGuideModel.create({ username, email, password, YOE, mobileNumber, previousWork, termsAccepted, role:"tour guide" });
      res.status(200).json(tourguide);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

 const getTourGuide = async (req, res) => {
   const username = req.query.userName;
   if (!username) {
     return res.status(400).json({ error: 'userName query parameter is required' });
   }
 
   try {
     const tourguide = await tourGuideModel.findOne( {userName:username} );
     if (!tourguide) {
       return res.status(404).json({ error: 'Tour guide not found' });
     }
     res.status(200).json(tourguide);
   } catch (error) {
     res.status(500).json({ error: 'Server error' });
   }
 };


const updateTourGuide = async (req, res) => {
      const { userName } = req.body; 
      const { mobileNumber,YOE,previousWork  } = req.body;
      try {
         const tourGuide = await tourGuideModel.findOneAndUpdate({userName }, { mobileNumber,YOE, previousWork}, { new: true });
         res.status(200).json(tourGuide); 
      } catch (error) {
         res.status(400).json({ error: error.message }); 
      }
   };
  



module.exports = {createTourGuide, getTourGuide, updateTourGuide};
