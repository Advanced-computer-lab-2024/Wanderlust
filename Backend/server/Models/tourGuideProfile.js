//const { string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const tourGuideSchema1 = new Schema({
    YOE:{
        type:Number,
        required:true
    },
    previousWork:{
        type:String
    }

});

// Merge the schemas
const TourGuidepf = mongoose.model('TourGuidepf', tourGuideSchema1);

module.exports = TourGuidepf;
