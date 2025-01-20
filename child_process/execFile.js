const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const sh = `echo 'start'
echo 'console.log(123)' > test.js
node test.js
echo 'end'
`;

const shellPath = path.resolve(__dirname, "foo.sh");
const jsPath = path.resolve(__dirname, "test.js");

if (fs.existsSync(jsPath)) {
  fs.rmSync(jsPath);
}

if (fs.existsSync(shellPath)) {
  fs.rmSync(shellPath);
}

fs.writeFileSync(shellPath, sh, { encoding: "utf8" });

// 增加文件执行权限
fs.chmodSync(shellPath, "755");

const ret = execFileSync(shellPath);

console.log(ret.toString());

fs.rmSync(jsPath);
fs.rmSync(shellPath);
