const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const socketioJwt = require("socketio-jwt");
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

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || 6379;

// Make Socket.io listen to Redis for pub/sub broadcasts
io.adapter(socketioRedis({ host, port }));

// Supply a route for the application load balancer to healthcheck on
app.get("/", function (req, res) {
  res.send("Healthy");
});

io.sockets
  .on(
    "connection",
    socketioJwt.authorize({
      secret: "SECRET",
      timeout: 15000,
      callback: false, // disconnects socket if auth fails
    })
  )
  .on("authenticated", (socket) => {
    // do stuff with authenticated sockets
    console.log(`hello! ${socket.decoded_token.name}`);

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
