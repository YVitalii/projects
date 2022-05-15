/*
set PORT=3033 
set DEVELOPMENT=1 
nodemon --exec "mocha -c" -w "./" -w "./db/tree/*" 
supervisor --no-restart-on exit -i ./db/tree/test --program ./bin/www

*/

const mongoose = require("mongoose");
const connectionString = require("../../../configs/db_config").connectionString;

let chaiHttp = require("chai-http");
let chai = require("chai");
let expect = chai.expect;
chai.use(chaiHttp);
console.log("process.env.port=" + process.env.port);
console.log("process.env.development=" + process.env.development);

let port = Number(process.env.PORT ? process.env.PORT : 3000);
let app = "http://localhost:" + port + "/tree/";

console.log("server=" + app);

// // ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";

console.log(" ---------> Test started:  " + new Date().toLocaleString());

before((done) => {
  setTimeout(async function () {
    let trace = 1;
    log("w", "Before started:" + new Date().toLocaleString());
    // створюємо підключення до бази
    let connection = await mongoose
      .createConnection(connectionString)
      .asPromise();
    trace
      ? log(
          "i",
          " DB: Connection to base: '" + connection.name + "' established"
        )
      : null;
    // видаляємо колекцію
    await connection.dropCollection("trees");
    trace ? log("i", "DB: Collection 'trees' was dropped!") : null;
    // закриваємо підключення до бази
    await connection.close();
    trace ? log("i", "DB: Connection to base was closed") : null;
    done();
  }, 1000);
}); // очікуємо перезапуску сервера

describe("/folder/", () => {
  //this.timeout(3000);
  let folder = {
    title: "СНО-4.8.3/11",
    description: "Піч на склад",
  };

  // ----------------  "POST:/folder/add " --------------
  //console.dir(arguments);
  describe("POST:/folder/add", () => {
    log("w", "Tests started:" + new Date().toLocaleString());
    let path = "/folder/add";
    let id = "undefined";
    let childrenId;
    // -------------- пустий запит -----------
    it("Пустий запит на створення папки", (done) => {
      chai
        .request(app)
        .post(path)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          expect(res.body.err).to.be.a("object");
          done();
        });
    });
    //--------------- Створення проекту СНО-4.8.3/11  -----------------------
    it("Створення проекту 'СНО-4.8.3/11'", (done) => {
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          id = res.body.data._id;
          //console.log("---res.body.data._id----");
          //console.dir(id);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          done();
        });
    });
    //--------------- Створення проекту з однаковою назвою СНО-4.8.3/11  -----------------------
    it("Створення проекту з однаковою назвою 'СНО-4.8.3/11'", (done) => {
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          expect(res.body.err).to.be.a("object");
          done();
        });
    });

    //--------------- Створення проекту з існуючим батьком  -----------------------
    it(`Створення папки з існуючим батьком _id="${id}"`, (done) => {
      folder["parent"] = id;
      folder.title = "Корпус";
      folder.description = "Корпус печі";
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.data._id).to.be.a("string");
          childrenId = res.body.data._id;
          done();
        });
    });

    //--------------- Створення проекту з існуючим батьком  -----------------------
    it("Створення папки з існуючим батьком _id=" + id, (done) => {
      folder["parent"] = id;
      folder.title = "Двері";
      folder.description = "Двері печі";
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.data._id).to.be.a("string");
          done();
        });
    });

    //--------------- Створення проекту з неіснуючим батьком  -----------------------
    it("Створення папки з неіснуючим батьком", (done) => {
      //folder["parent"] = "6266d5f3bad48bbf6ebe66c7";
      folder.parent = id.slice(0, -3) + "bad";
      //console.log("folder.parent=", folder.parent);
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          expect(res).to.have.status(400);
          expect(res.body.err).to.be.a("object");
          done();
        });
    });
    //--------------- Створення дитини у дитини: Корпус.Каркас  -----------------------
    it("Створення дитини дитини", (done) => {
      //folder["parent"] = "6266d5f3bad48bbf6ebe66c7";
      folder.parent = childrenId;
      folder.title = "Каркас";
      folder.description = "Несуча рама";
      //console.log("folder.parent=childrenId=", folder.parent);
      chai
        .request(app)
        .post(path)
        .query(folder)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body.data._id).to.be.a("string");
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

describe("/folder/delete", () => {});
// //console.log(" ---------> Test started");
