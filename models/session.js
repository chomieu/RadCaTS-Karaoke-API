const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SessionSchema = new Schema({
  host: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  karaokeSong: {
    type: Schema.Types.ObjectId,
    ref: "Song"
  },
  scores: {
    type: Array,
    default: []
  }
});

const Session = mongoose.model("Session", SessionSchema)

module.exports = Session