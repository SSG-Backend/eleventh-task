const express = require('express');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");

const dbConnect = require('./db');
dotenv.config({ path: "./main.env" });

//mongoose.connect(dbConfig.url, {useNewUrlParser: true, useUnifiedTopology: true});
dbConnect();

const app = express();

require('./passport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));