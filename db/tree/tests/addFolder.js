/*

*/

let chaiHttp = require("chai-http");
let chai = require("chai");
chai.use(chaiHttp);

let expect = chai.expect;
let app;

// // ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";

const d = describe("POST:/folder/add", () => {
  //this.timeout(3000);
  let folder = {
    title: "СНО-4.8.3/11",
    description: "Піч на склад",
  };

  // ----------------  "POST:/folder/add " --------------

  //log("w", "Tests started:" + new Date().toLocaleString());
  let path = "/folder/add";
  let id = "undefined";
  let childrenId;
  // -------------- пустий запит -----------
  it("Пустий запит на створення папки", (done) => {
    chai
      .request(this.app)
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
      .request(this.app)
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
  //--------------- Створення проекту СШАМ-7.12/7 -----------------------
  it("Створення проекту 'СШАМ-7.12/7'", (done) => {
    let folder = {
      title: "СШАМ-7.12/7",
      description: "Алюпол",
    };
    chai
      .request(this.app)
      .post(path)
      .query(folder)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
  //--------------- Створення проекту з однаковою назвою СНО-4.8.3/11  -----------------------
  it("Створення проекту з однаковою назвою 'СНО-4.8.3/11'", (done) => {
    chai
      .request(this.app)
      .post(path)
      .query(folder)
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body.err).to.be.a("object");
        done();
      });
  });

  //--------------- Створення проекту з існуючим батьком  -----------------------
  it(`Створення папки з існуючим батьком СНО-4.8.3/11-Корпус`, (done) => {
    folder["parent"] = id;
    folder.title = "Корпус";
    folder.description = "Корпус печі";
    chai
      .request(this.app)
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
  it("Створення папки з існуючим батьком СНО-4.8.3/11-Двері", (done) => {
    folder["parent"] = id;
    folder.title = "Двері";
    folder.description = "Двері печі";
    chai
      .request(this.app)
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
      .request(this.app)
      .post(path)
      .query(folder)
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res.body.err).to.be.a("object");
        done();
      });
  });
  //--------------- Створення дитини у дитини: Корпус.Каркас  -----------------------
  it("Створення дитини дитини СНО-4.8.3/11-Корпус-Каркас", (done) => {
    folder.parent = childrenId;
    folder.title = "Каркас";
    folder.description = "Несуча рама";
    chai
      .request(this.app)
      .post(path)
      .query(folder)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.data._id).to.be.a("string");
        done();
      });
  });
}); //describe

module.exports = (server) => {
  this.app = server;
  log("w", "Imported app=", this.app);
  return d;
};
