const River = require("./river.js");
const river = new River({ host: "http://localhost:3000" });

document.getElementById("join_room").addEventListener("click", (e) => {
  river.subscribe(document.getElementById("room").value);
});

document.getElementById("say_hello").addEventListener("click", (e) => {
  river.emit("event", {
    name: document.getElementById("name").value,
    channel: document.getElementById("room").value,
  });
});

river.on("event", (message) => {
  const li = document.createElement("li");
  li.innerHTML = message;
  document.getElementById("messages").append(li);
});
