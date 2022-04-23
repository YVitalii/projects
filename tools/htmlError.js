function htmlError(err, data = null) {
  err["en"] = "Error! " + (err.en ? err.en : "");
  err["ru"] = "Ошибка! " + (err.ru ? err.ru : "");
  err["ua"] = "Сталася помилка! " + (err.ua ? err.ua : "");
  return JSON.stringify({ err, data });
}
module.exports = htmlError;

if (!module.parent) {
  console.log(htmlError({ en: "Fail", ru: "Жопа", ua: "Капець" }));
}
