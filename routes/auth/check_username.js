const express = require("express");
let app = express.Router();
var bcrypt = require("bcryptjs");
const User = require("/opt/render/project/src/Models/User");

app.post("/", async (req, res) => {
  console.log(req.body);
  const { username } = req.body;
  try {
    if(await User.findOne({username})) {
      return res.send({
        status: "error",
        message: "Username "+username+" is not available."
      });
    } else {
      return res.send({
        status: "success",
        message: "Guest Account registered successfully!"
      });
    }
  } catch (errors) {
    console.log(errors);
    if (errors) return { status: "error", error: errors };
  }
});

module.exports = app;
