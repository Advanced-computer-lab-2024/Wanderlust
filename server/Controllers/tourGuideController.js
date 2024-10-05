// #Task route solution
const tourGuideModel = require('../Models/tourGuide.js');
const { default: mongoose, get } = require('mongoose');

const createTourGuide = async(req,res) => {
    //add a new user to the database with 
    //Name, Email and Age
    const {userName,YOE,mobileNumber,previousWork}=req.body;
    try{
       const tourguide=await tourGuideModel.create({userName,YOE,mobileNumber,previousWork});
       res.status(200).json(tourguide)
    }catch(error){
       res.status(400).json({error:error.message})
    }
 }

 const getTourGuide = async (req, res) => {
   try {
      // Fetch the username from query parameters (e.g., ?username=ah1)
    

      // Find the tour guide by username
      const tourGuide = await tourGuideModel.findOne({ userName: "AmrHesham1" });

      // If no tour guide is found, return 404
      if (!tourGuide) {
         return res.status(404).json({ error: 'Tour guide not found' });
      }

      // Send the tour guide details in response
      res.status(200).json(tourGuide);
   } catch (error) {
      res.status(400).json({ error: error.message });
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
  

const deleteTourGuide = async (req, res) => {
   //delete a user from the database
  }


module.exports = {createTourGuide, getTourGuide, updateTourGuide, deleteTourGuide};
