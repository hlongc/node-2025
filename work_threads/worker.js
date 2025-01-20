const { parentPort } = require("node:worker_threads");

parentPort.on("message", (msg) => {
  console.log("worker收到主线程消息：", msg);

  parentPort.postMessage("我收到你的消息了");

  parentPort.close();
});
