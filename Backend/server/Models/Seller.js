const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const SellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required:true
    }
});

//Middleware to set createdAt and updatedAt
//...
SellerSchema.pre('save', function(next) {
    const now = Date.now();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

const Seller = User.discriminator('Seller', SellerSchema);
module.exports = Seller;


