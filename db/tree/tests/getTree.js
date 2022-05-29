let chaiHttp = require("chai-http");
let chai = require("chai");
let expect = chai.expect;
chai.use(chaiHttp);
let app;

// // ------------ логгер  --------------------
const log = require("../../../tools/log.js"); // логер
let logName = "<" + __filename.replace(__dirname, "").slice(1) + ">:";

let path = "/getTree";

const d = describe("/folder/getTree/", () => {
  it("Пустий запит на отримання гілки дерева", (done) => {
    chai
      .request(this.app)
      .post(path)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.a("object");
        done();
      });
  });

  // it("Видалення теки, що не має дітей: Корпус-Каркас ", async (done) => {
  //   chai
  //     .request(this.app)
  //     .post(path)
  //     .query(folder)
  //     .end(function (err, res) {
  //       id = res.body.data._id;
  //       //console.log("---res.body.data._id----");
  //       //console.dir(id);
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.a("object");
  //       done();
  //     });
  // });
  // //--------------- Створення проекту з однаковою назвою СНО-4.8.3/11  -----------------------
  // it("Видалення теки, що має дітей СНО-4.8.3/11", (done) => {
  //   chai
  //     .request(this.app)
  //     .post(path)
  //     .query(folder)
  //     .end(function (err, res) {
  //       expect(res).to.have.status(400);
  //       expect(res.body.err).to.be.a("object");
  //       done();
  //     });
  // });
}); //describe

module.exports = (server) => {
  this.app = server;
  log("w", "Imported app=", this.app);
  return d;
};
