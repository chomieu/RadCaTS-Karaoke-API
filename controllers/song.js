const router = require("express").Router();
const db = require("../models");

// Deletes all stored songs
router.delete("/api/song/deleteAll", (req, res) => {
  db.Song.remove().then(() => {
    res.send("All songs deleted!")
  })
})

module.exports = router;