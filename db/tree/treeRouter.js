const mongoose = require("mongoose");
const Tree = require("./treeModel.js");
const maxItemsQty = require("../../configs/db_config.js").maxGetItemsPerTime;
var express = require("express");
var router = express.Router();
const htmlError = require("../../tools/htmlError.js");

// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
//const res = require("express/lib/response");
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)
// ----------- настройки логгера локальные --------------
// let logN=logName+"описание:";
// let trace=0;   trace = (gTrace!=0) ? gTrace : trace;
// trace ? log("i",logN,"Started") : null;
// trace ? log("i",logN,"--- ---") : null;
// trace ? console.dir() : null;

async function addFolder(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "addFolder:";
  let trace = 1;
  trace = gTrace != 0 ? gTrace : trace;
  trace ? log("i", logN, "Started") : null;
  trace ? log("i", logN, "--- req.query ---") : null;
  trace ? console.dir(req.query) : null;
  let data = req.query;
  //data.isFolder = data.isFolder ? true : false;
  data["isFolder"] = Boolean(data.isFolder);
  data.parent = data.parent ? data.parent.trim() : "";
  if ((data.parent === "null") | (data.parent === "") | (data.parent === "0")) {
    // если родителя нет: это корневая папка
    data.parent = null;
    data.isFolder = true; // в корне не может быть документ
    let one = await Tree.findOne({ title: data.title }).exec();
    /* перевіряємо на унікальність імені проекту */
    trace
      ? log("i", logN, "--- Tree.findOne({ title: data.title })= ---")
      : null;
    trace ? console.dir(one) : null;
    if (one) {
      res.status(400).send(
        htmlError(
          {
            en: "Title of project must be unique!",
            ru: "Наименование проекта должно быть уникальным",
            ua: "Назва проекту повинна бути унікальною",
          },
          data
        )
      );
      return;
    }
  } else {
    // перевіряємо чи є в базі такий батько
    let one = await Tree.findById(data.parent).exec();
    trace ? log("i", logN, "--- Tree.findById({ parent }).exec(); ---") : null;
    trace ? console.dir(one) : null;
    if (!one) {
      res.status(400).send(
        htmlError(
          {
            en: "Parent not found in the specified!",
            ru: "Родителя с таким id не найдено!",
            ua: "Батька з таким id не знайдено!",
          },
          data
        )
      );
      return;
    }
  }

  trace ? log("i", logN, "data.parent=", data.parent) : null;
  //data.parent === "null" ? null :  ;
  trace ? log("i", logN, "--- data ---") : null;
  trace ? console.dir(data) : null;
  try {
    let item = await Tree.create(data);
    res.status(200).json({ err: null, data: item });
  } catch (error) {
    let msg = "Error of creating new folder: " + error.message;
    log("e", msg);
    res.status(500).send("Error:" + msg);
  }
}

router.post("/addFolder", addFolder);

/**
 * GET items/getByName маршрут для поиска материалов по частичному совпадению имени
 * возвращает обьект {err,data}, где err - обьект ошибки, а data = Array []
 * */

async function getByName(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "getByName('" + JSON.stringify(req.query) + "'):";
  let trace = 0;
  trace = gTrace != 0 ? gTrace : trace;
  trace ? log("i", logN, "Started") : null;
  let selectFields = {
    _id: 1,
    name: 1,
    techUnits: 1,
    accUnits: 1,
    techToAcc: 1,
    quantity: 1,
    price: 1,
    weightTech: 1,
  };
  let name = req.query.name;
  trace ? log("i", "GET: /items/getByName: name=", name) : null;
  if (!name) {
    res.status(400).json({
      err: {
        en: "Not found parameter: name ",
        ru: "Не найден параметр name",
        ua: "Не знайдено параметр name",
      },
      data: null,
    });
    return;
  }

  let query = await Item.find({ name: new RegExp(name, "i") })
    .select(selectFields)
    .limit(maxItemsQty)
    .sort({ name: 1 })
    .exec();
  log("i", "Sended data[0]=", query[0]);
  trace ? log("i", "----> query= ") : null;
  trace ? console.log(query) : null;
  res.json({ err: null, data: query });
} //function getByName

module.exports = router;
