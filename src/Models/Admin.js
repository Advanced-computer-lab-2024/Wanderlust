const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    //in the password field, we are setting the type to String, required to true, 
    //and adding a custom validator to ensure that the password is at least 6 characters long and is alphanumeric.
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password! Password must be at least 6 characters long and contain both letters and numbers.`
        }
    },
    role: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
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

//Middleware to set createdAt and updatedAt
//...
AdminSchema.pre('save', function(next) {
    const now = Date.now();
    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;


