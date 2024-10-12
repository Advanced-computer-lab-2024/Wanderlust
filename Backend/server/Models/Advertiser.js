const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const urlValidator = (v) => {
  const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return urlRegex.test(v);
};


const AdvertiserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
},
  companyWebsite: {
    type: String,
    required: true,
    validate: {
        validator: urlValidator,
        message: props => `${props.value} is not a valid URL!`
    }
},
companyProfile: {
    type: String,
    required: true,
    validate: {
        validator: urlValidator,
        message: props => `${props.value} is not a valid URL!`
    }
},
hotline: {
    type: String,
    required: true
},

});

//Middleware to set createdAt and updatedAt
//...


const Advertiser = mongoose.model('Advertiser', AdvertiserSchema);
module.exports = Advertiser;
