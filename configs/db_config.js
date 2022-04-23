const config = {
  connectionString:
    "mongodb://express:Danya@localhost:27017/projects?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false",
  maxGetItemsPerTime: 10,
};

/* ----------- настройки для тестирования ---------- */
if (process.env.debug) {
  config.connectionString =
    "mongodb://express:Danya@localhost:27017/test_projects?authSource=WorkersDB&readPreference=primary&appname=Express&ssl=false";
}
console.log("DB connection string=", config.connectionString);

module.exports = config;
