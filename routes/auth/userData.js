const express = require("express");
let app = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("Models/User");

app.use(express.json());
// ENVIRONMENT VARIABLES
require("dotenv").config();

app.post("/", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
    User.findOne({username: user.username}).then(function(data) {
      return res.json({
        status: "success",
        data: data
      });
    }).catch(function(err) {
      return res.json({
        status: "error",
        message: err
      });
    });
  } catch (error) {
    return res.json({ status: "error", data: error });
  }
});

module.exports = app;
