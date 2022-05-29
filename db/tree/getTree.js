const mongoose = require("mongoose");
const Tree = require("./treeModel.js");
const htmlError = require("../../tools/htmlError.js");
// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
//const res = require("express/lib/response");
const logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0;

async function getTree(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "getTree:";
  let trace = 1;
  trace = gTrace != 0 ? gTrace : trace;
  //trace ? log("i", logN, "Started") : null;
  trace ? log("i", logN, "--- req.query ---") : null;
  trace ? console.dir(req.query) : null;
  //
  let _id = req.query._id ? req.query._id : null;
  _id = _id === "#" ? null : _id;
  trace ? log("i", logN, "req.query._id=", _id) : null;
  //
  if (!_id) {
    // якщо це корінь дерева , то передаємо список проектів
    let data = await getCore();
    trace ? log("i", logN, "Sended answer = ") : null;
    trace ? console.dir(data) : null;
    res.status(200).json(data);
    return;
  }
  let data = await getAll(_id);

  // let data = [];
  // for (let i = 0; i < list.length; i++) {
  //   data.push(list[i]._doc);
  // }
  // let answer = [];
  // for (let i = 0; i < data.length; i++) {
  //   let obj = {};
  //   let d = data[i];
  //   obj["text"] = (d.parent ? d.code + "." : "") + d["title"];
  //   obj["id"] = d["_id"].toString();
  //   if (d.children.length > 0) {
  //     obj["children"] = true;
  //   }
  //   answer.push(obj);
  // }
  trace ? log("i", logN, "Sended answer = ") : null;
  trace ? console.dir(data) : null;
  res.status(200).json(data);
} //function getTree

module.exports = getTree;

async function getAll(_id) {
  let res = [];
  let item = await getChild(_id);
  let doc = parseDoc(item);
  if (item.children.length == 0) {
    return doc;
  }
  doc["children"] = [];
  // якщо є діти, то опитуємо їх всіх
  for (let i = 0; i < item.children.length; i++) {
    doc.children.push(await getAll(item.children[i]));
  }
  return doc;
}

/** Форматує дані перед відсиланням клієнту */
function parseDoc(_doc) {
  let res = {};
  res["text"] =
    (_doc.parent ? ("0" + _doc.code + ". ").slice(-4) : "") + _doc.title;
  res["type"] = _doc.isFolder ? "folder" : "leaf";
  res["data"] = { code: _doc.code, parent: _doc.parent };
  res["id"] = _doc._id.toString();
  if (_doc.parent === null && _doc.children.length > 0) {
    res["children"] = true;
  }
  return res;
} //parseData

async function getChild(_id) {
  let logN = logName + "getChild(" + _id + "):";
  let trace = 0;
  let list = await Tree.findById(_id).exec();
  let _doc = list._doc;
  trace ? log("i", logN, "_doc = ") : null;
  trace ? console.dir(_doc) : null;
  return _doc;
} //getChild(_id)

async function getCore() {
  let list = await Tree.find({ parent: null }).exec();
  let data = [];
  for (let i = 0; i < list.length; i++) {
    data.push(parseDoc(list[i]._doc));
  }
  return data;
}
