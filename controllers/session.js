const router = require("express").Router();
const db = require("../models");
const LRC = require("lrc.js");
const fs = require("fs");
const path = require("path");
const jwt_decode = require('jwt-decode');

// Deletes all stored sessions
router.delete("/api/session/deleteAll", (req, res) => {
  db.Session.remove().then(() => {
    res.send("All sessions deleted!")
  })
})

// Creates a new karaoke session
// Req.body format we need from frontend = 
// {
//    host: user_id,
//    karaokeSong: song_id (comes from the search through /api/song route)
// }
// Returns the new session's id
router.post("/api/session", (req, res) => {
  db.Session.create(req.body)
    .then(data => {
      res.json(data._id)
    })
    .catch(err => {
      if (err) throw err
    })
})

// Finds created session by id
// Returns all of karaoke song's data and files
router.get("/api/session/:id", (req, res) => {
  db.Session.findOne({ _id: req.params.id }).populate("karaokeSong")
    .then(sessionData => {
      db.Song.findOne({ _id: sessionData.karaokeSong._id }).then(songData => {
        fs.readFile(path.join(__dirname, `../lrc/${songData.lyrics}`), async (err, data) => {
          let parsed = await LRC.parse(data.toString());
          const lyrics = JSON.stringify(parsed)
          console.log("songData", songData)
          songData.lyrics = lyrics
          res.json(songData)
        });
      })
    })
    .catch(err => {
      if (err) throw err
    })
})

// At the end of each karaoke session
// Req.body we need from frontend =
// {
//    token: "token",
//    score: number
// }
router.put("/api/session/:id", (req, res) => {
  // 1. Finds user via token and add the karaoke session to their records
  const user = jwt_decode(req.body.token)
  db.User.findOneAndUpdate({ _id: user.id }, { $addToSet: { records: [req.params.id] } })
    .then(() => {
      res.send("Session added to user's records!")
    })
  // 2. Updates Session.members with the user's id and Session.scores with the user's score
  db.Session.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { members: [id], scores: [{ id: req.body.score }] } })
    .then(() => {
      res.send("New member added!")
    })
    .catch(err => {
      if (err) throw err
    })
})

module.exports = router;
