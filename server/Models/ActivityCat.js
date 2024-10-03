//this is a new file a new attempt to create a model for the activity category

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, { timestamps: true });

const ActivityCat = mongoose.model('ActivityCat', ActivityCatSchema);
module.exports = ActivityCat;