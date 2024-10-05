const { date } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarySchema = new mongoose.Schema({
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
}, 
{ timestamps: true }); 

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;