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
      const songObj = {}
      data.map(song => { songObj[`"${song.name} - ${song.artist}"`] = null })
      res.json(songObj)
    })
    .catch(err => {
      if (err) throw err
    })
})

module.exports = router;