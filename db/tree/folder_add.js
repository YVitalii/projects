//  const mongoose = require("mongoose");
//  const Tree = require("./db/tree/treeModel.js");
//  mongoose.createConnection("mongodb://express:Danya@localhost:27017/test_projects?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false")
//

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
async function addFolder(req, res) {
  // ----------- настройки логгера локальные --------------
  let logN = logName + "addFolder:";
  let trace = 0;
  trace = gTrace != 0 ? gTrace : trace;
  //trace ? log("i", logN, "Started") : null;
  trace ? log("i", logN, "--- req.query ---") : null;
  trace ? console.dir(req.query) : null;
  let data = req.query;
  data.isFolder = true; // за цією адресою має завжди має бути тека
  // ---- перевірка title -------------
  if (!data.title) {
    // якщо немає назви - помилка
    res.status(400).send(
      htmlError(
        {
          en: "Title is required field!",
          ru: "Нет наименования папки",
          ua: "Не вказана назва папки",
        },
        data
      )
    );
    return;
  }

  // ---     перевірка батька   ----------------
  let parent;
  data.parent = data.parent ? data.parent.trim() : "";
  if ((data.parent === "null") | (data.parent === "") | (data.parent === "0")) {
    // если родителя нет: это корневая папка
    data.parent = parent = null;
  } else {
    // перевіряємо чи є в базі такий батько
    parent = await Tree.findById(data.parent).exec();
    //parent = parent["_doc"];
    trace
      ? log(
          "i",
          logN,
          `--- перевіряємо чи є в базі такий батько Tree.findById({ ${data.parent} })=parent=`
        )
      : null;
    trace ? console.dir(parent) : null;
    if (!parent) {
      res.status(400).json(
        htmlError(
          {
            en: "Parent with this id not found!",
            ru: "Родителя с таким id не найдено!",
            ua: "Батька з таким id не знайдено!",
          },
          data
        )
      );
      return;
    }
  }

  /* -------- перевіряємо на унікальність імені проекту для даного батька ---------------- */
  let one = await Tree.find({ parent: data.parent, title: data.title });

  trace
    ? log(
        "i",
        logN,
        `--- перевіряємо на унікальність імені проекту  для даного батька: Tree.find({ parent: ${data.parent}, title: ${data.title} })= `
      )
    : null;
  trace ? console.dir(one) : null;
  if (one.length > 0) {
    let text = " req.querry.title=" + JSON.stringify(data.title);
    let response = htmlError(
      {
        en: "For each parent the Title of project must be unique!" + text,
        ru:
          "Для каждого родителя наименование проекта должно быть уникальным" +
          text,
        ua: "Для кожного батька назва проекту повинна бути унікальною" + text,
      },
      data
    );

    res.status(400).json(response);
    return;
  }

  try {
    // робимо спробу записати теку в базу
    data.code = 0; // номер в массиві дітей батька, поки 0
    if (parent) {
      // запамятовуємо номер дитини
      data.code = parent._doc.children.length;
    } //if (data.parent)
    trace ? log("i", logN, "--- Дані для запису в базу data= ---") : null;
    trace ? console.dir(data) : null;
    //  створюємо документ
    let item = await Tree.create([data]);
    trace ? log("i", logN, "--- Дані після запису в базу item= ---") : null;
    trace ? console.dir(item) : null;
    // записуємо зміни в батька

    if (parent) {
      parent._doc.children.push(item[0]._doc._id);
      let newParent = await Tree.findByIdAndUpdate(parent._doc._id, {
        children: parent._doc.children,
      }).exec();
    }

    res.status(200).json({ err: null, data: item[0] });
  } catch (error) {
    // Помилка запису - помилка
    let msg = error.message;
    log("e", msg);
    res.status(500).send(
      htmlError(
        {
          en: "Can`t insert record to base: " + msg,
          ru: "Ошибка записи в базу: " + msg,
          ua: "Помилка запису в базу: " + msg,
        },
        data
      )
    );
  }
}

module.exports = addFolder;
