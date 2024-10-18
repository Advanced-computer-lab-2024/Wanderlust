const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const advertiserSchema = new Schema({
    website: {
        type: String,
        required: true
    },
    hotline: {
        type: String,
        required: true
    },
    companyProfile: {
        type: String,
        required: true
    }
});

// Merge the schemas
const Advertiser = User.discriminator('Advertiser', advertiserSchema);

module.exports = Advertiser;