const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const touristSchema = new Schema({
    nationality: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true,
    },
    jobOrStudent: {
        type: String,
        required: true
    },
});

const Tourist = User.discriminator('Tourist', touristSchema);

module.exports = Tourist;