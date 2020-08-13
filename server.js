const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const socketioRedis = require("socket.io-redis");
const port = 3000;

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

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

// Make Socket.io listen to Redis for pub/sub broadcasts
async function connectToRedis() {
  try {
    await io.adapter(socketioRedis({ redisHost, redisPort }));
  } catch (error) {
    console.error(error);
  }
}

// Supply a route for the application load balancer to healthcheck on
// app.get("/", function (req, res) {
//   res.send("Healthy");
// });

io.on("connection", (socket) => {
  socket.on("subscribe", (channel) => {
    socket.join(channel);
    socket.emit("event", "Joined channel " + channel);
    socket.broadcast
      .to(channel)
      .emit("event", "Someone joined channel " + channel);
  });

  socket.on("unsubscribe", (channel) => {
    socket.leave(channel);
    socket.emit("event", "Left room " + channel);
  });

  socket.on("event", (e) => {
    socket.broadcast.to(e.channel).emit("event", e.name + " says hello!");
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
