var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/tree", function (req, res, next) {
  res.render("tree", { title: "Tree view" });
});

module.exports = router;
