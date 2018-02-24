const express = require('express');
const games = express.Router();
const igdb = require('igdb-api-node').default;
const client = igdb('f14503ac37b7f24e3f23b0277ba67084');
var list;

// games.post('/search', (req, res) => {
//   client.games({
//     fields: 'name'
//   }).then(res => {
//     list = res.body;
//     console.log(list);
//   }).catch(err => {
//     throw err;
//   });
//   res.render('games/index', {list: list});
// });

// games.post('/search', (req, res) => {
//   // client.endpoint(options, [fields])
//   client.games({
//     search: req.body.search,
//     }, 
//     [
//       'name'
//     ])
//   .then(res => {
//     list = res.body;
//   })
//   .catch(err => {
//     throw err;
//   });
//   setTimeout(() => {
//     res.render('games/index', {list});
//   }, 1000);
// });

module.exports = games;