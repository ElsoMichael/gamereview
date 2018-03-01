const express = require('express');
const games = express.Router();
const igdb = require('igdb-api-node').default;
const client = igdb('1accb007bd5cc4dad101e324f97acb0e');
var list;
var game;

// Only some titles display the images
games.post('/search', (req, res) => {
  // client.endpoint(options, [fields])
  client.games({
    filters: {
      'version_parent-not_exists': 1
    },
    search: req.body.search,
    limit: 50,
    }, [
      'name',
      'cover',
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

// Hit when someone clicks Game Title in List of Games
games.get('/:id', (req, res, next) => {
  const gameId = req.params.id;

  client.games({
    ids: [gameId],
    fields: '*',
    expand: [
      'genres',
      'platforms',
      'themes',
      'games',
      'developers',
      'publishers',
      'game_engines',
      'player_perspectives',
      'game_modes',
    ]
  })
  .then(res => {
    game = res.body;
    console.log(game);
  })
  .catch(err => {
    throw err;
  })
  setTimeout(() => {
    res.render('games/view', {game: game});
  }, 1000);
});


module.exports = games;