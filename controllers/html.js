const router = require("express").Router();
const db = require("../models");
const YoutubeMusicApi = require("youtube-music-api");
const api = new YoutubeMusicApi();
const path = require("path");
const Mp3 = require("./mp3");
const { lrcParser, createLrc } = require("./lrc.js");
const fs = require("fs");

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

router.get("/session", (req, res) => {
  const { artist, song } = req.body;
  api
    .initalize() // Retrieves Innertube Config
    .then((info) => {
      if (!artist && !song) {
        res.json({ err: "Please enter a valid input." });
      } else if (!artist && song) {
        api.search(song.name, song.type).then((songResult) => {
          console.log(songResult);
          const songName = songResult.content[0].name.toLowerCase();
          const artistName = songResult.content[0].artist.name.toLowerCase();
          fs.readdir(path.join(__dirname, "../music/mp3"), (err, data) => {
            console.log(data);
            if (data.indexOf(`${songName} - ${artistName}.mp3`) === -1) {
              createLrc(songName, artistName);
              Mp3(songResult.content[0].videoId, songName, artistName);
            }
          });
          res.send("downloaded");
        });
      } else if (artist.name && !song.name) {
        api.search(artist.name, artist.type).then((artistResult) => {
          console.log(artistResult);
        });
      } else {
        api.search(artist.name, artist.type).then((searchResult) => {
          console.log(searchResult);
          api.getArtist(searchResult.browseId).then((artistResult) => {
            res.json(artistResult);
          });
        });
      }
    });
});

// lrcParser(path.join(__dirname, "../music/lrc/Baby Shark - Pink Fong.lrc"))

module.exports = router;
