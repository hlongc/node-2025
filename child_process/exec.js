/**
 * exec是底层通过execFile实现 execFile底层通过spawn实现
 */

const { execSync } = require("node:child_process");

const ret = execSync("node -v", { encoding: "utf-8" });

console.log(ret.toString());
