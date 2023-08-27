const express = require("express");
let app = express.Router();

// Auth Files
const Login = require("./login");
const Register = require("./register");
const UserDetails = require("./userData");
const checkUsername = require("./check_username");

app.use("/login", Login);
app.use("/register", Register);
app.use("/user-details", UserDetails);
app.use("/check-username", checkUsername);

module.exports = app;
