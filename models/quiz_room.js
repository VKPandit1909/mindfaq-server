const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    hostUsername: {
        type: String,
        required: true,
    },
    roomCode: {
        type: String,
        required: true,
        unique: true,
    },
    users: [],
    userCount: {
        type: String,
        required: true,
        default: 1,
    },
    quizData: {},
    quizStarted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    modifiedAt: {
        type: Date,
        default: () => Date.now(),
    },
});

module.exports = mongoose.model("Room", roomSchema);