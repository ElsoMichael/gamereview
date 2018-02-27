const express = require("express");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const authRouths = express.Router();

// User Model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRouths.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRouths.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRouths.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRouths.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRouths.get("/user-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("user-page", { user: req.user });
});

authRouths.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRouths;