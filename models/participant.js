const mongoose = require('mongoose');

// Participant Schema
const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        sparse: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'], 
        default: 'Pending',
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Participant = mongoose.model('participant', participantSchema);

module.exports = Participant
