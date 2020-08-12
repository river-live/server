// const io = require("socket.io-client");
const io = require("../node_modules/socket.io-client");

class River {
  constructor(options) {
    this.host = options.host;
    this.socket = io(this.host, { path: "/" });
  }

  subscribe(channel) {
    this.socket.emit("subscribe", channel);
  }

  unsubscribe(channel) {
    this.socket.emit("unsubscribe", channel);
  }

  disconnect() {
    this.socket.close();
  }

  on(eventName, callback) {
    this.socket.on(eventName, (data) => {
      callback(data);
    });
  }
}

module.exports = River;