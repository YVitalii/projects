/* supervisor --no-restart-on exit ./db/treeManager/treeManagerModel.js */

// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Tree = new Schema({
  title: {
    // Імя, наприклад "СНО-4.8.3/11ВЦ" або "Корпус"
    type: String,
    trim: true,
    index: true,
    required: true,
    // unique: true, не може бути унікальним, наприклад: Двері
  },
  parent: {
    // батько
    type: Schema.Types.ObjectId,
    default: null,
    index: true,
  },
  description: {
    // короткий опис для підказки
    type: String,
    default: "",
  },
  children: {
    // список дітей
    type: [Schema.Types.ObjectId],
    default: [],
  },
  code: {
    // список дітей
    type: Number,
    default: null,
  },
  isFolder: {
    // мітка папки
    type: Boolean,
    default: false,
  },
}); //TreeShema

let model = mongoose.model("tree", Tree);
module.exports = model;

if (!module.parent) {
  let connStr = require("../../configs/db_config").connectionString;
  (async () => {
    let trace = 1;
    function l(name, item) {
      if (trace) {
        log("i", "------ ", name, "= ------");
        console.log(item); //, { depth: 2 }
      }
    }
    let items;
    await mongoose.connect(connStr);
    log("i", "Connected to DB:", connStr);
    // items = await model.getByName("кутн");
    // l("items[0]", items[0]);
    // items = await model.getById("624d3c520588aede29c8fbba");
    // l("byId", items);
  })();
}
