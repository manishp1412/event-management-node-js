const mongoose = require('mongoose');

// Participant Schema
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

const Participant = mongoose.model('participant', participantSchema);

module.exports = Participant
