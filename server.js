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

// TODO Define constant with host and port that defaults to localhost and 6379 when process.env is not defined

// Make Socket.io listen to Redis for pub/sub broadcasts
// TODO put in try/catch statement, so lack of Redis doesn't crash app
io.adapter(
  socketioRedis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT })
);

// Supply a route for the application load balancer to healthcheck on
app.get("/", function (req, res) {
  res.send("Healthy");
});

io.on("connection", (socket) => {
  // TODO change to "subscribe"
  socket.on("room-join", (room) => {
    socket.join(room);
    socket.emit("event", "Joined room " + room);
    socket.broadcast.to(room).emit("event", "Someone joined room " + room);
  });

  // TODO add "unsubsrcribe" event
  socket.on("event", (e) => {
    socket.broadcast.to(e.room).emit("event", e.name + " says hello!");
  });
});

server.listen(80, () => {
  console.log("Server started");
});
