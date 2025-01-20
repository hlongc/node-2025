process.on("message", (msg) => {
  console.log("子进程收到主进程消息", msg);
  process.send("子进程收到消息");
  process.exit();

  process.disconnect();
});
