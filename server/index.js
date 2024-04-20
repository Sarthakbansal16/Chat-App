const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ApiError } = require("./utils/ApiError.js");
const userRoutes = require("./routes/userRoutes.js");
const messagesRoute = require("./routes/messagesRoute.js");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messagesRoute);


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
 console.log("DB connection Successful");
})
.catch((err) => {
  console.log("error")  
  // throw new ApiError(500,"Something went wrong while connectiong the database")
})

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// new users map
global.onlineUsers = new Map();

// Socket IO Logic
io.on("connection", (socket) => {
  global.chatSocket = socket;
  // Add user
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Send message
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    // check message recieved
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});