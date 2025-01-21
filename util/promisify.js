const childProcess = require("child_process");
// const { promisify } = require("util");

function promisify(originFn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      originFn(...args, (error, ...values) => {
        if (error) {
          return reject(error);
        }

        if (values.length === 1) {
          resolve(values[0]);
        } else {
          const obj = {};

          for (const key in values) {
            obj[key] = values[key];
          }

          resolve(obj);
        }
      });
    });
  };
}

const exec = promisify(childProcess.exec);

exec("node -v").then(console.log);
