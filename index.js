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
    if (socketsConnected.length < 2 && socketsConnected.length !== 1)
      socket.join(room);
    else if (socketsConnected.length === 1) {
      socket.join(room);
      io.to(socket.id).emit("activate_game", room);
    } else {
      io.to(socket.id).emit("room_is_full");
      console.log("the room is full");
      // send "room is full" warning to the socket
    }
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
      io.to(socket.id).emit("activate_game", room);
    } else {
      queue.push(socket);
      console.log("inside generate room: ", queue.length); /////////////////////////////
    }

    socket.on("disconnecting", () => {
      queue = queue.filter((item) => item.id !== socket.id); // remove from the queue for random players
      console.log("inside disconnection event: ", queue.length); /////////////////////////

      // notify opponent of disconnection event:
      let roomsToQuit = socket.rooms; // a set that contains socket id and all rooms the socket is in
      roomsToQuit.forEach((room) => {
        if (room !== socket.id) {
          socket.broadcast.to(room).emit("opponent_left"); 
        }
      });
    });
  });

  socket.on("send_move", (data) => {
    socket.broadcast.to(data.roomNumber).emit("receive_move", data.moveObj); // on frontend: socket.emit("send_move", { move, room });
  });

  socket.on("leave_game", (data) => {
    console.log("leave game request received");
    console.log(data.roomNumber);
    socket.broadcast.to(data.roomNumber).emit("opponent_left");
    console.log("inside leave game event: ", queue.length); //////////////////////////
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001...");
});
