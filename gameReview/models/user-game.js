const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserGameSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  summary: { type: String, required: true },
  _creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('UserGame', UserGameSchema);
