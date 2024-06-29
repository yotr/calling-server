const express = require("express");
const app = express();
const http = require("http");
var cors = require("cors");
const server = http.createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });
// const io = new Server(server);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// })

io.on("connection", (socket) => {
  // when joining room
  socket.on("join-room", async (roomId, userId) => {
    socket.join(roomId)
    // send connected user id
    socket.to(roomId).emit('user-connected', userId);

    socket.on("hangup", (data) => {
      socket.to(roomId).emit("hangup", data)
    })

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId)
    })
  })

  socket.on("call", (data) => {
    socket.broadcast.emit('call-data', data);
    // io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  })
  socket.on("answer", (data) => {
    socket.broadcast.emit('answer', data);
  })

  socket.on("cancel", (data) => {
    socket.broadcast.emit('cancel', data);
  })

  socket.on("call-timeout", (data) => {
    socket.broadcast.emit('timeout', data);
  })

})

server.listen(5000, () => console.log("server is running on port 5000"))