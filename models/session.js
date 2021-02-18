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
  records: [{
    type: Schema.Types.ObjectId,
    ref: "Song"
  }]
});

const Session = mongoose.model("Session", SessionSchema)

module.exports = Session