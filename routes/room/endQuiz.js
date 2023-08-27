const express = require("express");
let app = express.Router();

const Room = require("../../models/quiz_room");

// ENVIRONMENT VARIABLES
require("dotenv").config();

app.post("/", async (req, res) => {
  const { room_code } = req.body;
  const room = await Room.findOne({roomCode: room_code});
  if(room) {
    await Room.updateOne(
        {
            roomCode: room_code
        },
        {
            $set: {
                quizStarted: true,
            }
        }
    );
    return res.json({
      status: "success",
      data: {userCount: room.userCount, quizStarted: true}
    });
  } else {
    return res.json({
      status: "error",
      message: "Room does not exist."
    });
  }

});

module.exports = app;
