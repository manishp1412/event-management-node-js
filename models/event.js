const mongoose = require('mongoose');
// Mongoose Schema

const participantSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'], 
        default: 'Pending',
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });


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
    participants: {
        type: [participantSchema],
        default: [],
    },
}, {timestamps: true});

const Event = mongoose.model("event", eventSchema);

module.exports = Event;