const mongoose = require('mongoose');

const GuideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    steps: { type: [String], required: true } // Array of step strings
});

module.exports = mongoose.model('Guide', GuideSchema);
