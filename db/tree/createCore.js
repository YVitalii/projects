/**
 * Модуль створює базову структуру папок проектів:
 * структура описана в змінній core
 */

//const mongoose = require("mongoose");
//const Tree = require("./treeModel.js");
// ------------ логгер  --------------------
const log = require("../../tools/log.js"); // логер
//const res = require("express/lib/response");
const logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0;
// ----------- chai --------------------
let chaiHttp = require("chai-http");
let chai = require("chai");
chai.use(chaiHttp);
// --------------------------------
const app = require("../../configs/app_config.js").appPath + "/folder/add";

let core = [
  {
    title: "Виробництво",
    description: "Замовлені та оплачені вироби",
    isFolder: true,
    children: [
      {
        title: "Промислові",
        description: "Великі промислові печі",
        isFolder: true,
      },
      { title: "Лабораторні", description: "Настільні печі", isFolder: true },
      {
        title: "Водообробка",
        description: "Вироби для обробки води",
        isFolder: true,
      },
      {
        title: "Комплектуючі",
        description: "Замовлення запчастин або матеріалів",
        isFolder: true,
      },
    ],
  },
  {
    title: "Внутрішні роботи",
    description:
      "Проекти по модернізації обладниння, технологій, тех обсл. та ін.",
    isFolder: true,
    children: [
      {
        title: "Техн. обслуговування",
        description: "Роботи по догляду за обладнанням",
        isFolder: true,
      },
      {
        title: "Модернізація",
        description: "Виготовлення нового / покращення існуючого обладнання.",
        isFolder: true,
      },
    ],
  },
];

async function makeOne(one) {
  let trace = 1;
  trace ? log("i", logName, "Create " + one.title) : null;
  await chai
    .request(this.app)
    .post("/folder/add")
    .end(function (err, res) {
      if (err) reject(err);
      resolve(res.data);
    });
}

async function makeMany(parent, arr) {
  for (let i = 0; i < arr.length; i++) {
    let item = await makeOne(arr[i]);
    if (arr[i].children) {
      makeMany(item._id, arr[i].children);
    }
  }
}

async function createCore() {
  log(
    "i",
    logName,
    " ----------- Створення базової структури проектів ----------"
  );
  console.dir(core, { depth: 3 });
  log("i", "this.app=", this.app);
  await makeMany(null, core);
}

module.exports = (app) => {
  this.app = app;
  log("w", "Create core: this.app=", this.app);
  return createCore;
};
