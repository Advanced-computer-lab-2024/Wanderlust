const { date, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CommentSchema = new Schema({
  userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Assuming you have a User model
      required: true 
  },
  comment: { 
      type: String, 
      required: true 
  },
  createdAt: { 
      type: Date, 
      default: Date.now 
  }
});


const itinerarySchema = new mongoose.Schema({
    creator: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'TourGuide', 
    },
    title: { 
          type: String,
          required: true
       },
    activities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    }], 
    locations: [{ type: String, required: true }], 
    timeline: {
        start: { type: Date, required: true }, // Start date and time of the itinerary
        end: { type: Date, required: true }, // End date and time of the itinerary
    },
    languageOfTour: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number,
       required: true
       }, 
    rating: { 
      type: Number, 
      required: false 
    },
    availableDates: [{ 
      type: Date, 
      required: true }], 
    accessibility: {
       type: String, 
      default: false }, 
    pickupLocation: { 
      type: String,
       required: true }, 
    dropoffLocation: { type: String, required: true }, 
    isActive: { 
      type: Boolean,
      default: true 
    },
    touristCount:{
      type: Number,
      default:0
    },
    
    flagged: {
      type: Boolean,
      default: false
  },
  ratings: [
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            required: false
        }
    }
]
}, 
{ timestamps: true }); 

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;