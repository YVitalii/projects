//supervisor --no-restart-on exit myTest.js
const log = require("../../tools/log.js"); // логер
const mongoose = require("mongoose");
const Tree = require("./treeModel.js");
const conString = require("../../configs/db_config.js").connectionString;
(async () => {
  await mongoose.connect(conString);
  log("w", "Connection to base established (" + conString + ")");
  let item = await Tree.find({
    parent: null,
    title: "СНО-4.8.3/11",
  });
  log("i", "item=");
  console.dir(item);
})();
