const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      review: {
        type: String,
        required: false
      }
    }
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },
  sales: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  picture: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
