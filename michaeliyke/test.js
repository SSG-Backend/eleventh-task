const {HOST, PORT, ENV} = require("./configs/config");
const express = require("express");
const express_layout = require("express-ejs-layouts");
const {log} = console;
const app = express();

app.use("/css", express.static(`${__dirname}/public/css`));
app.use("/js", express.static(`${__dirname}/public/js`));
app.use("/img", express.static(`${__dirname}/public/img`));

app.use(express_layout);
// app.set("layout", "views/layout")

app.set("view engine", "ejs");
app.get("/", (request, response, next) => {
  response.render("index");
});

app.listen(PORT, (error, success) => {
  console.log(ENV);
  log(`Listening at: ${HOST}:${PORT}`);
});