const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const authRoutes = express.Router();

// User Model
const User = require("../models/user");
const UserGame = require("../models/user-game");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Get Signup
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//Post Signup
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Checks for empty fields
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  // Checks for exisiting users
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    // Encrypts password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // Add Encryption to user Model
    const newUser = new User({
      username,
      password: hashPass
    });

    // Saves User
    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

// Get login
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

// Post login with Passport authentication
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// Gets Secure page for each User
authRoutes.get("/user-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/user-page", { user: req.user, game: req.userGame });
  consle.log(req.userGame)
});

// Grabs a Game a User Post
authRoutes.post("/infoGame", (req, res, next) => {
  const info = {
    title: req.body.title,
    link: req.body.link,
    summary: req.body.summary,
    _creator: req.user._id
  }

  // Adds it to Schema
  const newUserGame = new UserGame(info);

  // Saves the Game User Post
  newUserGame.save( (err) => {

    if (err) { return next(err) }

    // For now
    return res.redirect("/");
  });
});

// List of All Games User Post
authRoutes.get('/list', (req, res, next) => {
  UserGame.find({}, (err, game) => {
    if (err) {return next(err) }

    return res.render('games/user', { game });
  });
});



// Logout of User Account
authRoutes.get("/logout", ensureLogin.ensureLoggedOut(), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;