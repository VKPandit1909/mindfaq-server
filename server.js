const express = require("express");
var cors = require("cors");
var http = require("http");
const bodyParser = require("body-parser");
require('dotenv').config();

// express app
const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Public Uploads
app.use("/uploads", express.static("uploads"));

// MongoDB
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser:true, useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err)
    else console.log('Successfully connected to database!')
});

// Socket IO Initialization
var server = http.createServer(app);
var io = require("socket.io")(server, {
    cors: {
        "origin": "*"
    }
});

const Room = require("./models/quiz_room");
// Socket IO Implementation
io.on("connection", (socket) => {
    console.log("IO Server Connected");
    console.log(socket.id, " has joined.");

    // Create Quiz Room
    socket.on("create-quiz", (data, fn) => {
        socket.id = data.username;
        var usersList = [{username: data.username, points: 0}];
        Room.create({
            hostUsername: data.username,
            roomCode: data.room_code,
            userCount: 1,
            users: usersList,
            quizData: data.quiz
        });
        fn(data.room_code);
    });

    // Joining Multiple Users
    socket.on("join-quiz", async(data, fn) => {
        console.log(data);
        const room_code = data.room_code;
        const room_details = await Room.findOne({roomCode: room_code});
        console.log(room_details, "roomDetails");
        if(room_details == null) {
            return fn({
                status: "error",
                message: "Room does not exist."
            });
        }
        if(room_details.userCount >= 50) {
            return fn({
                status: "error",
                message: "Room is full."
            });
            
        };
        var usersList = room_details.users;
        usersList.push({username: data.username, points: 0});
        await Room.updateOne(
            {
                roomCode: room_code
            },
            {
                $set: {
                    userCount: parseInt(room_details.userCount) + 1,
                    users: usersList
                }
            }
        );
        socket.id = data.username;
        fn(JSON.stringify({total_count: parseInt(room_details.userCount)+1, quiz_data: room_details.quizData }));
    });

    // Delete on Leave
    socket.on("disconnect", async() => {
        const isHost = await Room.find({hostUsername: socket.id});
        console.log(socket.id, isHost);
        if(isHost.length == 0) {
            const rooms = await Room.find({'users.username': socket.id});
            console.log(rooms);
            for (const key in rooms) {
                if (Object.hasOwnProperty.call(rooms, key)) {
                    const element = rooms[key];
                    var users = element.users;
                    users = users.filter((user) => user.username != socket.id);
                    await Room.updateOne(
                        {
                            _id: element._id
                        },
                        {
                            $set: {
                                users: users,
                                userCount: users.length
                            }
                        }
                    );
                }
            }
        }
    });

});


// Importing Main Routing
const home = require("./routes/home");
const userAuth = require("./routes/auth/index");
const roomDetails = require("./routes/room/index");

// Routing
app.use("/", home);
app.use("/user", userAuth);
app.use('/room', roomDetails);
// app.use((req, res) => {
//     console.log("New Request Made");
//     console.log("Host", req.hostname);
//     console.log("Path", req.path);
//     console.log("Method", req.method);
//     res.status(404).send({
//       status: "error",
//       error: "Cannot " + req.method + " Method " + req.path,
//     });
// });

server.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
