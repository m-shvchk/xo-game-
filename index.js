const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (room) => {
    const socketsConnected = await io.in(room).fetchSockets();
    console.log(socketsConnected.length)
    if (socketsConnected.length < 2) socket.join(room)
    else console.log("the room is full")
  });

  socket.on("send_move", (data) => {
    socket.to(data.room).emit("receive_move", data);
  });

});

server.listen(3001, () => {
  console.log("Server is running on port 3001...");
});
