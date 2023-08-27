const express = require("express");
let app = express.Router();

const Room = require("../../models/quiz_room");

// ENVIRONMENT VARIABLES
require("dotenv").config();

app.post("/", async (req, res) => {
  const { roomCode, username, points } = req.body;
  console.log(req.body);
  const room = await Room.findOne({roomCode: roomCode});
  if(room) {
    var users = room.users;
    var objIndex = users.findIndex((obj => obj.username == username));
    // users[objIndex] = {
    //     username: username,
    //     points: points
    // };
    users[objIndex].points = points;
    var updateObj = {};
    if(room.hostUsername == username) {
        updateObj = {
            users: users,
            quizStarted: false
        };
        room.quizStarted = false;
    } else {
        updateObj = {
            users: users,
        };
    }
    await Room.updateOne(
        {
            roomCode: roomCode
        },
        {
            $set: updateObj
        }
    );
    return res.json({
      status: "success",
      data: {userCount: room.userCount, quizStarted: room.quizStarted}
    });
  } else {
    return res.json({
      status: "error",
      message: "Room does not exist."
    });
  }

});

module.exports = app;
