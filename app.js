var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
/* подключаемся к базе данных */
let connStr = require("./configs/db_config.js").connectionString;
(async () => {
  try {
    await mongoose.connect(connStr);
    console.log(
      " ------- > Connection to base: '" +
        mongoose.connections[0].name +
        "' established"
    );
    //console.dir(mongoose.connections, { depth: 2 });
  } catch (error) {
    console.error(error.message);
  }
})();

const treeRouter = require("./db/tree/treeRouter");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tree", treeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
