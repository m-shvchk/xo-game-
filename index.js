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

let queue = []; // queue to manage random pair of players - "generate_random_room" event

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // join room with known room number:
  socket.on("join_room", async (room) => {
    const socketsConnected = await io.in(room).fetchSockets();
    console.log(socketsConnected.length);
    if (socketsConnected.length < 2) socket.join(room);
    else console.log("the room is full");
  });

  // generate random room number and join room with that number:
  socket.on("generate_random_room", () => {
    console.log("generate_random_room triggered by: ", socket.id);
    if (queue.length > 0) {
      let peer = queue.pop();
      let room = socket.id + "#" + peer.id;
      peer.join(room);
      socket.join(room);
      io.to(socket.id).emit("room_generated", room);
      io.to(peer.id).emit("room_generated", room);
    } else {
      queue.push(socket);
    }

    // logic on user disconnecting (remove from the queue for random players):
    socket.on("disconnecting", () => {
      queue = queue.filter(item => item.id !== socket.id)
    });
  });

  socket.on("send_move", (data) => {
    socket.broadcast.to(data.roomNumber).emit("receive_move", data.moveObj); // on frontend: socket.emit("send_move", { move, room });
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001...");
});
