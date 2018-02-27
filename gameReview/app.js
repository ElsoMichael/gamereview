var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

// Mongoose Config
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/gamereview-local");

// Passport Configuration
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

// IDGB API Config
const igdb = require('igdb-api-node').default;
const client = igdb('1accb007bd5cc4dad101e324f97acb0e');

// Models
const User = require("./models/user");

// =====
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');
app.set('views', __dirname + '/views');

// Middleware
app.use(session({
  secret: "gamereview-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(flash());

passport.use(new localStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password"});
    }

    return next(null, user);

  });
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes 
var index = require('./routes/index');
var users = require('./routes/users');
const authRoutes = require("./routes/auth-routes");
const games = require('./routes/games');

// Directory
app.use("/", authRoutes);
app.use('/', index);
app.use('/users', users);
app.use('/games', games);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
