//const { string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const tourGuideSchema = new Schema({
    YOE:{
        type:Number,
        required:true
    },
    previousWork:{
        type:String
    }

});

// Merge the schemas
const TourGuide = User.discriminator('TourGuide', tourGuideSchema);

module.exports = TourGuide;


