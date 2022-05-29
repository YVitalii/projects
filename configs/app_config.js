// ------------ логгер  --------------------
const log = require("../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let trace = 0;
trace ? log("i", logName, "process.env.port=" + process.env.port) : null;
trace
  ? log("i", logName, "process.env.development=" + process.env.development)
  : null;

let conf = {};
// порт
conf.port = Number(process.env.PORT ? process.env.PORT : 3000);
trace ? log("i", logName, "conf.port =" + conf.port) : null;
// адрес сервера
conf.appPath =
  (process.env.development ? "http://localhost:" : "http://localhost:") +
  conf.port +
  "/";
trace ? log("i", logName, "conf.appPath =" + conf.appPath) : null;

module.exports = conf;
