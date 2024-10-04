const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Validator for URL
const urlValidator = (v) => {
  const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return urlRegex.test(v);
};

// Activity Schema
const ActivitySchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    validate: {
      validator: urlValidator,
      message: props => `${props.value} is not a valid URL!`
    }
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'ActivityCat', 
    required: false
  },
  tags: {
    type: mongoose.Types.ObjectId,
    ref: 'PreferenceTag',
    required: false
  },
  specialDiscounts: {
    type: String,
    required: false
  },
  bookingOpen: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field
ActivitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;
