import River from "./river.js";

const river = new River({ host: "http://localhost:3000" });
// const socket = io({ transports: ["websocket"], upgrade: false });

document.getElementById("join_room").addEventListener("click", (e) => {
  socket.emit("room-join", document.getElementById("room").value);
});

document.getElementById("say_hello").addEventListener("click", (e) => {
  socket.emit("event", {
    name: document.getElementById("name").value,
    room: document.getElementById("room").value,
  });
});

socket.on("event", (message) => {
  const li = document.createElement("li");
  li.innerHTML = message;
  document.getElementById("messages").append(li);
});
