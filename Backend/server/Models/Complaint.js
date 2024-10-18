const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending','resolved'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Complaints = mongoose.model('Complaint', ComplaintsSchema);
module.exports = Complaints;

//as specified in the requiremts the complaint needs to cover the follwing
//(title,body,date)
//status will always be pending when creating the complain
//it can be changed later only by admin