/**
 * spawn 用于执行一些实时获取的信息因为spawn返回的是流边执行边返回
 * exec是返回一个完整的buffer，buffer的大小是200k
 * 如果超出会报错，而spawn是无上限的。
 * spawn在执行完成后会抛出close事件监听，并返回状态码
 * 通过状态码可以知道子进程是否顺利执行
 * exec只能通过返回的buffer去识别完成状态，识别起来较为麻烦
 */

const { spawn } = require("node:child_process");

const { stdout } = spawn("netstat", ["-an"]);

stdout.on("data", (stream) => {
  console.log(stream.toString());
});

stdout.on("close", () => {
  console.log("命令执行完毕");
});
