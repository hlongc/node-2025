const { resolve } = require("node:path");
const { Worker } = require("node:worker_threads");

const worker = new Worker(resolve(__dirname, "worker.js"));

worker.postMessage("我是主进程");

worker.on("message", (msg) => {
  console.log("主进程收到：", msg);
});

worker.on("exit", (code) => {
  console.log("工作线程退出，退出码:", code);
});
