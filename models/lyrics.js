const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LyricsSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assiciatedSong: {
    type: Schema.Types.ObjectId,
    ref: "Song",
    required: true
  },
  lyrics: {
    type: Array,
    required: true
  }
});

const Lyrics = mongoose.model("Lyrics", LyricsSchema)

module.exports = Lyrics