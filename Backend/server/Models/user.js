const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
      },
      message:`Password must be at least 6 characters long and contain both letters in upper/lower caps and numbers.`
     }
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  termsAccepted: {
      type: Boolean,
      required: true,
      default: false,
      validate: {
        validator: function(v) {
          return v === true;
        },
        message: 'You must accept the terms and conditions.'
      }
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

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;