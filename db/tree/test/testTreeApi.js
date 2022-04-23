/*
set PORT=3033 
set DEVELOPMENT=1  
nodemon --exec "mocha -c" -w "./" -w "./test"
supervisor --no-restart-on exit -i ./db/tree/test --program ./bin/www

*/
//Подключаем dev-dependencies
const request = require("supertest");
let assert = require("chai").assert;
let chaiHttp = require("chai-http");
// console.log("process.env.port=" + process.env.port);
// //console.dir();
let port = process.env.PORT ? process.env.PORT : 3000;
let app = "http://localhost:" + port + "/tree/";
console.log("app=" + app);
// //const maxItemsQty = require("../../configs/db_config.js").maxGetItemsPerTime;
// // ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
// let gTrace = 0; //=1 глобальная трассировка (трассируется все)

// // ? const res = require("express/lib/response");

console.log(" ---------> Test started:  " + new Date().toLocaleString());

describe("/addFolder", () => {
  let folder = {
    title: "СНО-4.8.3/11",
    description: "Піч на склад",
  };
  // ----------------  "POST:/ addFolder" --------------
  //console.dir(arguments);
  describe("POST:/addFolder", () => {
    let path = "/addFolder";
    let id = "";
    // -------------- пустий запит -----------
    it("Пустий запит на створення папки", (done) => {
      request(app)
        .post(path)
        .expect(400)
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          //console.dir(res.text);
          done();
        });
    });
    //--------------- Створення проекту СНО-4.8.3/11  -----------------------
    it("Створення проекту СНО-4.8.3/11", (done) => {
      request(app)
        .post(path)
        //.send(folder)
        .query(folder)
        .expect(200)
        .end((err, res) => {
          id = JSON.parse(res.text).data._id;
          //console.dir(id);
          done();
        });
    });
    //--------------- Створення проекту з однаковою назвою СНО-4.8.3/11  -----------------------
    it("Створення проекту з однаковою назвою СНО-4.8.3/11", (done) => {
      request(app)
        .post(path)
        .query(folder)
        .expect(400)
        .end((err, res) => {
          done();
        });
    });
    //--------------- Створення проекту з існуючим батьком  -----------------------
    it("Створення папки з існуючим батьком", (done) => {
      folder["parent"] = id;
      folder.title = "Корпус";
      folder.description = "Корпус печі";
      request(app)
        .post(path)
        .query(folder)
        .expect(200)
        .end((err, res) => {
          let id = JSON.parse(res.text).data._id;
          done();
        });
    });
    //--------------- Створення проекту з неіснуючим батьком  -----------------------
    it("Створення папки з неіснуючим батьком", (done) => {
      folder["parent"] = id;
      folder.parent = folder.parent.slice(0, -1) + "a";
      request(app)
        .post(path)
        .query(folder)
        .expect(400)
        .end((err, res) => {
          done();
        });
    });

    // //--------------- пошук неіснуючого матеріалу  -----------------------
    // it('Пошук по запиту { name: "badMaterial" }', (done) => {
    //   request(app)
    //     .get(path)
    //     .query({ name: "badMaterial" })
    //     .expect(200)
    //     .then((res) => {
    //       let length = res.body.data.length;
    //       //console.log("res.body.data.length=", length);
    //       assert.equal(length, 0, "array.length must be 0");
    //       assert.isNull(res.body.err);
    //       done();
    //     });
    // }); // it
    // //--------------- пошук по точному співпадінню імені матеріалу  -----------------------
    // it('Пошук по запиту { name: "кутн 25х25х4; ст" }', (done) => {
    //   request(app)
    //     .get(path)
    //     .query({ name: "кутн 25х25х4; ст" })
    //     .expect(200)
    //     .then((res) => {
    //       let length = res.body.data.length;
    //       //console.log("res.body.data.length=", length);
    //       assert.equal(length, 1, "array.length must be 1");
    //       assert.isNull(res.body.err);
    //       done();
    //     });
    // }); // it
  }); //describe("GET:/getByName"
  // // ----------------  "GET:/getById" --------------
  // describe("GET:/getById", () => {
  //   let path = "/getById";
  //   it("Запит з неіснуючим id='6badID24d3e3675d53f257fb'", (done) => {
  //     let req = { id: "6badID24d3e3675d53f257fb" };
  //     request(app)
  //       .get(path)
  //       .query({ name: "кутн" })
  //       .expect(400)
  //       .end((err, res) => {
  //         if (err) {
  //           done(err);
  //           return;
  //         }
  //         //console.log("res.body.data=", res.body.data);
  //         assert.isNull(res.body.data, "Поле данних має бути null");
  //         assert.isObject(res.body.err);
  //         done();
  //       });
  //   });
  // }); //describe("GET:/getById"
}); //describe("/addFolder"

// //console.log(" ---------> Test started");
