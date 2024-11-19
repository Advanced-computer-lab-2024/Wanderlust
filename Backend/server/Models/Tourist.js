const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
const Product = require("./Products");

const touristSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  jobOrStudent: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "EGP",
  },
  badge: { type: String, default: "Bronze" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: [String],
    default: [],
  },
  
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  wishlist: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    default: [],
  },
  orderHistory: [
    {
      items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            required: true
          },
          price: {
            type: Number,
            required: true
          }
        }
      ],
      totalAmount: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      }
    }
  ]
}, { timestamps: true });

const Tourist = mongoose.model("Tourist", touristSchema);

module.exports = Tourist;
