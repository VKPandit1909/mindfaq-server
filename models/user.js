const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    socketId: String,
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

module.exports = mongoose.model("User", userSchema);