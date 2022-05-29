const mongoose = require("mongoose");
const Tree = require("./treeModel.js");
const htmlError = require("../../tools/htmlError.js");
// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
//const res = require("express/lib/response");
const logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0;

/**
 * Видаляє теку
 * @param {Object} req запит
 * @param {String} req.query.id id папки
 * @param {Object} res відповідь сервера
 * @returns {Object} відповідь {err:{en:"",ru:"",ua:""},data}; err - опис помилки або null; об'єкт {title:,_id:,..} з записаними даними
 */

async function deleteFolder(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "";
  let trace = 0;
  trace = gTrace != 0 ? gTrace : trace;
  trace ? log("i", logN, "Started") : null;
  trace ? log("i", logN, "--- req.query ---") : null;
  trace ? console.dir(req.query) : null;
  let data = req.query;
  // запит без id - відхиляємо
  if (!data._id) {
    let response = htmlError(
      {
        en: "Bad request!",
        ru: "Неправильный запрос",
        ua: "Невірний запит",
      },
      data
    );
    res.status(400).json(response);
    return;
  }
}

module.exports = deleteFolder;
