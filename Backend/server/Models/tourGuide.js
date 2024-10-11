//const { string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true,
    },
    YOE:{
        type:Number,
        required:true
    },
    previousWork:{
        type:String
    }

});

//Middleware to set createdAt and updatedAt
//...
tourGuideSchema.pre('save', function(next) {
    const now = Date.now();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

const tourGuide = mongoose.model('tourGuide', tourGuideSchema);
module.exports = tourGuide;


