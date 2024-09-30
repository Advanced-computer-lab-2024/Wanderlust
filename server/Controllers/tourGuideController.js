<<<<<<< Updated upstream
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

      const tourGuide = await tourGuideModel.find(); 
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
=======
const tourGuideModel = require('../Models/tourGuide.js');
const Itinerary = require('../Models/tgItinerary.js'); // Import the Itinerary model
const { default: mongoose, get } = require('mongoose');

// Tour Guide Routes

const createTourGuide = async (req, res) => {
    const { userName, YOE, mobileNumber, previousWork } = req.body;
    try {
        const tourguide = await tourGuideModel.create({ userName, YOE, mobileNumber, previousWork });
        res.status(200).json(tourguide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTourGuide = async (req, res) => {
    try {
        const tourGuide = await tourGuideModel.find();
        res.status(200).json(tourGuide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateTourGuide = async (req, res) => {
    const { userName } = req.body;
    const { mobileNumber, YOE, previousWork } = req.body;
    try {
        const tourguide = await tourGuideModel.findOneAndUpdate(
            { userName },
            { mobileNumber, YOE, previousWork },
            { new: true }
        );
        res.status(200).json(tourGuide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteTourGuide = async (req, res) => {
    const { userName } = req.body;
    try {
        await tourGuideModel.findOneAndDelete({ userName });
        res.status(200).json({ message: "Tour guide deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Itinerary Routes

const createItinerary = async (req, res) => {
    const {
        title,
        activities,
        locations,
        timeline,
        language,
        price,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation,
    } = req.body;

    try {
        const itinerary = await Itinerary.create({
            title,
            activities,
            locations,
            timeline,
            language,
            price,
            availableDates,
            accessibility,
            pickupLocation,
            dropoffLocation,
        });
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getItinerary = async (req, res) => {
    try {
        const itineraries = await Itinerary.find();
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        activities,
        locations,
        timeline,
        language,
        price,
        availableDates,
        accessibility,
        pickupLocation,
        dropoffLocation,
    } = req.body;

    try {
        const itinerary = await Itinerary.findByIdAndUpdate(
            id,
            {
                title,
                activities,
                locations,
                timeline,
                language,
                price,
                availableDates,
                accessibility,
                pickupLocation,
                dropoffLocation,
            },
            { new: true }
        );
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        await Itinerary.findByIdAndDelete(id);
        res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createTourGuide,
    getTourGuide,
    updateTourGuide,
    deleteTourGuide,
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary,
};
>>>>>>> Stashed changes
