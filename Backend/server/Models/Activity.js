const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Activity Schema
const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  lat: {
       type: Number,
        required: true
      },
  lng: {
        type: Number,
        required: true     
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: false
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'ActivityCat', 
    required: false
  },
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: 'PreferenceTag',
    required: false
  }],
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