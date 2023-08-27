const express = require("express");
let app = express.Router();
var bcrypt = require("bcryptjs");
const User = require("/opt/render/project/src/Models/User");

app.post("/", async (req, res) => {
  console.log(req.body);
  const { username, email, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const user_data = {
      username: username,
      email: email,
      password: password,
    };
    if(await User.findOne({username})) {
      return res.send({
        status: "error",
        message: "Username "+username+" is not available."
      });
    } else if(await User.findOne({email})) {
      return res.send({
        status: "error",
        message: "Email "+email+" already exist"
      });
    } else {
      await User.create(user_data);
      return res.send({
        status: "success",
        message: "Account registered successfully!"
      });
    }
  } catch (errors) {
    console.log(errors);
    if (errors) return { status: "error", error: errors };
  }
});

module.exports = app;
