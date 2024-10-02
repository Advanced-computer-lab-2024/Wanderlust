const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pictures: [{ data: Buffer, contentType: String }],
  location: { type: String, required: true },
  openingHours: { type: String, required: true },
  ticketPrices: { type: Number, required: true },
  tags: {
    type: [String],
    required: false,
  },
});

const Locations = mongoose.model("Locations", locationsSchema);
module.exports = Locations;
