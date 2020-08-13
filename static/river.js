const io = require("socket.io-client");

class River {
  constructor(options) {
    this.host = options.host;
    // this.socket = io(this.host, { transports: ["websocket"], upgrade: false });
    this.socket = io({ transports: ["websocket"], upgrade: false });
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

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }
}

module.exports = River;
