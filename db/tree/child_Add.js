const mongoose = require("mongoose");
const Tree = require("./treeModel.js");
const htmlError = require("../../tools/htmlError.js");
// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
//const res = require("express/lib/response");
const logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0;

/**
 *
 * @param {Object} req запит
 * @param {String} req.query.title Ім'я папки
 * @param {ObjectId} req.query.parent Ім'я батька
 * @param {Object} res відповіді
 * @returns {Object} відповідь {err:{en:"",ru:"",ua:""},data}; err - опис помилки або null; об'єкт {title:,_id:,..} з записаними даними
 */

async function childAdd(parentId, childId) {
  let num; //номер дитини в масиві
  // ----  шукаємо батька -------------
  try {
    let parent = await Tree.findOne({ _id: parentId }).exec();
    num = parent.children.push(childId);
    let res = await Tree.updateOne(
      { _id: parentId },
      { children: parent.children }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = addFolder;

// ----------- настройки логгера локальные --------------
//   let logN = logName + "addFolder:";
//   let trace = 0;
//   trace = gTrace != 0 ? gTrace : trace;

//   return Tree.findOne({ _id: parentId })
//     .exec()
//     .then((data) => {
//       data.children.push(childId);
//       return data;
//     })
//     .then((data) => {
//       return Tree.updateOne({ _id: parentId }, { children: data.children });
//     })
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
