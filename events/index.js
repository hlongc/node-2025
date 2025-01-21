const { EventEmitter } = require("./events");

const event = new EventEmitter();

function fn(...args) {
  console.log("fn", ...args);
}

event.on("test", fn);
event.on("test", fn);

event.once("test", fn);

event.emit("test", 1, 2);
// event.off("test", fn);
event.removeListener("test", fn);
event.emit("test", 3, 4);
event.removeListener("test", fn);
event.emit("test", 5, 6);
