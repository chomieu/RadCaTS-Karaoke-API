const router = require("express").Router();
const db = require("../models");

// Finds all songs in the database
// Returns 1.song id and 2.formatted-name
router.get("/api/song", (req, res) => {
  db.Song.find({})
    .sort([["name", 1]])
    .then((data) => {
      console.log(data);
      const songObj = {};
      data.map((song) => (songPbj.name = `${song.name} - ${song.artist}`));
      res.json(songObj);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

module.exports = router;
