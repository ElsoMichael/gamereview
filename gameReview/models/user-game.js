const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserGameSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  summary: { type: String, required: true },
  _creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const UserGame = mongoose.model('UserGame', UserGameSchema);
module.exports = UserGame;
