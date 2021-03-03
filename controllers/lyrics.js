const router = require("express").Router();
const db = require("../models");
const { lrcParser } = require("../controllers/lrc");
const mongoose = require('mongoose');

// return all lyrics related to specific song
router.get("/api/lyrics/:songId", (req, res) => {
    db.Lyrics.find({ associatedSong: req.params.songId }).populate("associatedSong").populate("creator")
        .then(lyrics => {
            console.log(lyrics)
            res.json(lyrics)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get("/api/lyric/:id", (req, res) => {
    db.Lyrics.find({ _id: req.params.id })
        .then(lyrics => {
            console.log(lyrics)
            res.json(lyrics)
        })
        .catch(err => {
            console.log(err)
        })
})

//post route
router.post("/api/lyrics", (req, res) => {
    const { creator, associatedSong, lyrics } = req.body;
    const lyricsJSON = lrcParser(lyrics);
    db.Lyrics.create({ creator, associatedSong, lyrics: JSON.parse(lyricsJSON) })
        .then(lyricsData => {
            console.log(lyricsData);
            res.json(lyricsData)
        })
        .catch(err => {
            console.log(err)
        })
})

//put route 
router.put("/api/lyrics", (req, res) => {
    const { creator, associatedSong, lyrics } = req.body;
    const lyricsJSON = lrcParser(lyrics);
    db.Lyrics.findOneAndUpdate({ creator, associatedSong }, { lyrics: JSON.parse(lyricsJSON) })
        .then(lyricsData => {
            console.log(lyricsData);
            res.json(lyricsData)
        })
        .catch(err => {
            console.log(err)
        })
})

//delete all lyrics
router.delete("/api/lyric", (req, res) => {
    db.Lyrics.remove().then(() => {
        res.send("All lyrics deleted!")
    })
})

module.exports = router;