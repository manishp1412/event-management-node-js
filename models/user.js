const mongoose = require('mongoose');

// Mongoose Schema
const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone_number: {
        type: Number,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Organizer', 'Participant'],
        required: true,
    },
}, {timestamps: true});

const User = mongoose.model("user", userSchema);

module.exports = User;