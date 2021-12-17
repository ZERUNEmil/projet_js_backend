var express = require('express');
var logger = require('morgan');
var cookieSession = require('cookie-session');

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authsRouter = require('./routes/auth');

const { Pool } = require('pg');

var app = express();
let expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1h;
app.use(
  cookieSession({
    name: "user",
    keys: ["689HiHoveryDi79*"],
    cookie: {
      httpOnly: true,
      expires: expiryDate,
    },
  })
)

app.pool = new Pool({
  user: process.env.USERNAMEDB,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORTDB,
  ssl: {
    rejectUnauthorized: false
  }
});

app.pool.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auths', authsRouter);

module.exports = app;

