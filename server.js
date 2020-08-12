const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const socketioRedis = require("socket.io-redis");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  pingTimeout: 60000,
});

app.use(express.static("static"));

// Accept requests from all origins
app.use(cors());

io.origins((origin, callback) => {
  callback(null, true);
});

// Make Socket.io listen to Redis for pub/sub broadcasts
// io.adapter(
//   socketioRedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
// );

// Supply a route for the application load balancer to healthcheck on
app.get("/", function (req, res) {
  res.send("Healthy");
});

io.on("connection", (socket) => {
  socket.on("room-join", (room) => {
    socket.join(room);
    socket.emit("event", "Joined room " + room);
    socket.broadcast.to(room).emit("event", "Someone joined room " + room);
  });

  socket.on("event", (e) => {
    socket.broadcast.to(e.room).emit("event", e.name + " says hello!");
  });
});

server.listen(3000, () => {
  console.log("Server started");
});
