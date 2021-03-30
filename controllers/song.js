const router = require("express").Router();
const db = require("../models");

// Finds all songs in the database
// Returns 1.song id and 2.formatted-name
router.get("/api/song", (req, res) => {
  db.Song.find({}).sort([['name', 1]])
    .then(data => {
      res.json(data)
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// Deletes all stored songs
router.delete("/api/song/deleteAll", (req, res) => {
  db.Song.remove().then(() => {
    res.send("All songs deleted!")
  })
})

router.post("/api/song", (req, res) => {
  db.Song.create(req.body)
    .then(() => {
      res.send("song added")
    })
    .catch(err => {
      if (err) throw err;
    })
})

router.put("/api/song/:id", (req, res) => {
  db.Song.updateOne({ _id: req.params.id }, { name: req.body.name, artist: req.body.artist })
    .then((data) => {
      res.json(data)
    })
    .catch(err => {
      if (err) throw err;
    })
})

router.delete("/api/song/:id", (req, res) => {
  db.Song.remove({ _id: req.params.id })
    .then((data) => {
      res.json(data)
    })
    .catch(err => {
      if (err) throw err;
    })
})

module.exports = router;