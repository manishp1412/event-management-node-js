const mongoose = require('mongoose');
const Participant = require('./participant'); // Importing the Participant model

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'], 
        default: 'Active',
    },
    participants: {
        type: [Participant.schema],
        default: [],
    },
}, {timestamps: true});

const Event = mongoose.model("event", eventSchema);

module.exports = Event;