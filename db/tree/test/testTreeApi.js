//Подключаем dev-dependencies
const request = require("supertest");
let assert = require("chai").assert;
let chaiHttp = require("chai-http");
let port = process.env.PORT ? process.env.PORT : 3000;
let app = "http://localhost:" + port + "/tree/";
//const maxItemsQty = require("../../configs/db_config.js").maxGetItemsPerTime;
// ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";
let gTrace = 0; //=1 глобальная трассировка (трассируется все)

// ? const res = require("express/lib/response");

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
          //console.log("res.body.data=", res.body.data);
          //assert.isNull(res.body.data, "Поле данних має бути null");
          //assert.isObject(res.body.err);
          done();
        });
    });
    // //--------------- пошук списком з  -----------------------
    // it('Пошук по запиту { name: "кутн" }', (done) => {
    //   request(app)
    //     .get(path)
    //     .query({ name: "кутн" })
    //     .expect(200)
    //     .then((res) => {
    //       let length = res.body.data.length;
    //       //console.log("res.body.data.length=", length);
    //       assert.equal(
    //         length,
    //         maxItemsQty,
    //         "array.length must be " + maxItemsQty
    //       );
    //       assert.isNull(res.body.err);
    //       done();
    //     });
    // });
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

//console.log(" ---------> Test started");
