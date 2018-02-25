const express = require('express');
const games = express.Router();
const igdb = require('igdb-api-node').default;
const client = igdb('1accb007bd5cc4dad101e324f97acb0e');
var list;


// Only some titles display the images
games.post('/search', (req, res) => {
  // client.endpoint(options, [fields])
  client.games({
    fields: 'cover',
    search: req.body.search,
    limit: 50
    }, [
      'cover'
    ])
  .then(res => {
    list = res.body;
    console.log(list);
  })
  .catch(err => {
    throw err;
  });
  setTimeout(() => {
    res.render('games/index', {list});
  }, 1000);
});

module.exports = games;