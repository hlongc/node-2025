const EventEmitter = require("events");

const event = new EventEmitter();

function fn(...args) {
  console.log("fn", ...args);
}

event.on("test", fn);
event.on("test", fn);

event.once("test", fn);

event.emit("test", 1, 2);
