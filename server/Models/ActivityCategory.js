const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});



const ActivityCategory = mongoose.model('ActivityCategory', ActivityCategorySchema);
module.exports = ActivityCategory;
