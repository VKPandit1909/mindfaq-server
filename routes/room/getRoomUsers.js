const express = require("express");
let app = express.Router();

const Room = require("../../models/quiz_room");

// ENVIRONMENT VARIABLES
require("dotenv").config();

app.post("/", async (req, res) => {
  const { roomCode } = req.body;
  console.log(req.body);
  const room = await Room.findOne({roomCode: roomCode});
  if(room) {
    return res.json({
      status: "success",
      data: {userCount: room.userCount, users: room.users}
    });
  } else {
    return res.json({
      status: "error",
      message: "Room does not exist."
    });
  }

});

module.exports = app;
