const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SongSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  lyrics: {
    type: String,
    required: true
  },
  instrumental: {
    type: String,
    required: true
  },
  mixed: {
    type: String,
    required: true
  }
});

const Song = mongoose.model("Song", SongSchema)

module.exports = Song