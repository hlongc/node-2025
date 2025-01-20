/**
 * fork 创建的子进程有完全独立的资源和事件循环
 * 操作系统可以更好地调度 I/O 操作
 * 进程间隔离提供了更好的容错性
 * 特别适合需要长时间运行的 I/O 任务
 * 可以充分利用多核系统的优势
 */

const { fork } = require("node:child_process");

const forkProcess = fork("./test.js");

forkProcess.send("我是主进程，收到请回复");

forkProcess.on("message", (data) => {
  console.log("收到fork子进程消息", data);
});

forkProcess.on("exit", () => {
  console.log("子进程已退出");
});
