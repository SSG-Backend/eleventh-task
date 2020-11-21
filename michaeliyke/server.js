const {HOST, PORT, ENV} = require("./configs/config");
const express = require("express");
const session = require("express-session");

const cookiePaser = require("cookie-parser");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const {log} = console;
const l = log;

const app = express();

// app.use(cookiePaser());

// app.set("view engine", "ejs");

const bodyParser = require("body-parser");

mongoose.connect(`mongodb://127.0.0.1:27017/${ENV.DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  name: ENV.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: ENV.SESSION_SECRETE,
  cookie: {
    maxAge: ENV.SESSION_LIFETIME,
    sameSite: true,
    secure: ENV.IN_PROD
  },
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// Serve static files from the public directory
app.use(express.static(`${__dirname}/public`, {
  dotfiles: "ignore",
  etag: false,
  extensions: ["htm", "html"],
  index: false,
  setHeaders(response, path, stat) {
    response.set("x-timestamp", Date.now())
  }
}));

// ROUTER
app.use("/", require("./router/navigation.routes"));
// Proof againt 404
const fall_through_list = ["/favicon.ico", ".map"];
app.use((request, response, next) => {
  // log(".originalUrl", request.originalUrl);
  const error = new Error("File Not Found");
  error.status = 404;
  // request.baseUrl // request.originalUrl // request.path
  for (const string of fall_through_list) {
    if (string == request.originalUrl || string == path.extname(request.originalUrl)) {
      return response.end();
    }
  }
  next(error);
});

// LAST CALL TO MAKE - Error handling middle ware
app.use((error, request, response) => {
  response.status(error.status || 500);
  response.send(error && error.message ? error.message : "Internal server error");
});

app.listen(ENV.PORT, () => {
  log(`Server On, ${HOST}:${PORT}`);
});