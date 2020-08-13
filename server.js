const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const socketioRedis = require("socket.io-redis");
const socketioJwt = require("socketio-jwt");
const process = require("process");
const port = process.argv[2] || 3000;
// const port = 80;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  pingTimeout: 60000,
});

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const jwtSecret = process.env.APP_ID || "SECRET";

// Accept requests from all origins
app.use(cors());

io.origins((origin, callback) => {
  callback(null, true);
});

// Make Socket.io listen to Redis for pub/sub broadcasts
io.adapter(socketioRedis({ redisHost, redisPort }));

// Supply a route for the application load balancer to healthcheck on
// app.get("/", function (req, res) {
//   res.send("Healthy");
// });

io.sockets
  .on(
    "connection",
    socketioJwt.authorize({
      secret: jwtSecret,
      timeout: 15000,
      callback: false, // disconnects socket if auth fails
    })
  )
  .on("authenticated", (socket) => {
    // do stuff with authenticated sockets
    console.log(`hello! ${socket.decoded_token.name}`);

    socket.on("subscribe", (channel) => {
      socket.join(channel);
    });

    socket.on("unsubscribe", (channel) => {
      socket.leave(channel);
    });
  });

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
