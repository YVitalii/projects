// // ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
log("w", logName, " ---------> Test started:  " + new Date().toLocaleString());

console.log("process.env.port=" + process.env.port);
console.log("process.env.development=" + process.env.development);
let port = Number(process.env.PORT ? process.env.PORT : 3000);

const mongoose = require("mongoose");
const connectionString = require("../../configs/db_config").connectionString;

const app = "http://localhost:" + port + "/tree/";
console.log("server name =" + app);

before((done) => {
  // очікуємо перезапуску сервера
  setTimeout(async function () {
    let trace = 1;
    log("w", "Before started:" + new Date().toLocaleString());
    // створюємо підключення до бази
    let connection = await mongoose
      .createConnection(connectionString)
      .asPromise();
    trace
      ? log(
          "i",
          " DB: Connection to base: '" + connection.name + "' established"
        )
      : null;
    // видаляємо колекцію
    try {
      await connection.dropCollection("trees");
      trace ? log("i", "DB: Collection 'trees' was dropped!") : null;
    } catch (error) {
      log("e", "Drop collection failed: " + error.message);
    }

    // закриваємо підключення до бази
    await connection.close();
    trace ? log("i", "DB: Connection to base was closed") : null;
    done();
  }, 1000);
});

require("./tests/addFolder.js")(app);
require("./tests/deleteFolder.js")(app);

after((done) => {
  log("w", "End tests");
  done();
});
