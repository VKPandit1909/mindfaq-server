const express = require("express");
let app = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("/Models/User");

// ENVIRONMENT VARIABLES
require("dotenv").config();

app.post("/", async (req, res) => {
  const { username_login, password_login } = req.body;
  const user = await User.findOne({username: username_login});
  if(!user) {
    return res.json({
      status: "error",
      message: "User does not exist. Please login."
    });
  }
  if(await bcrypt.compare(password_login, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET
    );
    return res.json({ status: "success", data: token });
  } else {
    return res.json({
      status: "error",
      message: "User does not exist. Please login."
    });
  }
});

module.exports = app;
