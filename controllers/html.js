const router = require("express").Router();
const db = require("../models");

// Populates homepage with user data
router.get("/", (req, res) => {
  db.User.findOne(req.body)
    .populate("records")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Finds all songs in the database
// Returns 1.song id and 2.formatted-name 
router.get("/api/song", (req, res) => {
  db.Song.find({}).sort([['name', 1]])
    .then(data => {
      let songObj = {}
      let songArr = data.map(song => { songObj.id = song._id, songObj.name = `${song.name} - ${song.artist}` })
      res.json(songArr)
    })
    .catch(err => {
      if (err) throw err
    })
})

module.exports = router;
