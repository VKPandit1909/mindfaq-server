const express = require("express");
let app = express.Router();

// Auth Files
const userCount = require("./userCount");
const startQuiz = require("./startQuiz");
const submitQuiz = require("./submitQuiz");
const endQuiz = require("./endQuiz");
const getUsersResults = require("./getRoomUsers");

app.use("/user-count", userCount);
app.use("/start-quiz", startQuiz);
app.use("/submit-quiz", submitQuiz);
app.use("/end-quiz", endQuiz);
app.use("/get-users-results", getUsersResults);

module.exports = app;
