const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: "https://i.imgur.com/owu9ukE.jpeg"
  },
  records: [{
    type: Schema.Types.ObjectId,
    ref: "Song"
  }]
});

const User = mongoose.model("User", UserSchema)

module.exports = User