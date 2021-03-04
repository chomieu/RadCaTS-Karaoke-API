const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LyricsSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  associatedSong: {
    type: Schema.Types.ObjectId,
    ref: "Song",
    required: true
  },
  lyrics: {
    type: Object,
    required: true
  }
});

const Lyrics = mongoose.model("Lyrics", LyricsSchema)

module.exports = Lyrics