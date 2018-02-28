var express = require('express');
var router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// Model's
const UserGame = require("../models/user-game");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// router.get('/', (req, res, next) => {
//   UserGame.find({}, (err, game) => {
//     if (err) {return next(err) }

//     res.render('games/user', { game: game });
//   });
// });
module.exports = router;