var express = require('express');
var logger = require('morgan');
var cookieSession = require('cookie-session');

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
  user: 'tvfnuvevgtmeyb',
  host: 'ec2-52-19-164-214.eu-west-1.compute.amazonaws.com',
  database: 'dbmf7fllohl6qj',
  password: '5afb53089a1fcc88f56c18b466b333deb340beddba9a8b085b5be031005bd7c3',
  port: 5432,
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

