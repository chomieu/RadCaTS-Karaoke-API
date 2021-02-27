const router = require("express").Router();
const db = require("../models");
const axios = require("axios").default;
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const { createLrc } = require("./lrc.js");
const fs = require("fs");
const path = require("path");

router.post("/api/download", (req, res) => {
  musicApi
    .initalize() // Retrieves Innertube Config
    .then(() => {
      if (!req.body.name) {
        res.json({ err: "Please enter a valid input." });
      } else {
        musicApi.search(req.body.name, "song").then((songResult) => {

          const songName = songResult.content[0].name.toLowerCase();
          const artistName = songResult.content[0].artist.name.toLowerCase();
          
          fs.readdir(path.join(__dirname, "../lrc"), (err, data) => {
            if (data.indexOf(`${songName} - ${artistName}.lrc`) === -1) {
              createLrc(songName, artistName);

              const options = {
                method: "GET",
                url: "https://youtube-to-mp32.p.rapidapi.com/yt_to_mp3",
                params: { video_id: songResult.content[0].videoId },
                headers: {
                  "x-rapidapi-key":
                    "5d41389558mshc739796a61beb69p102c43jsn1612f6aaee40",
                  "x-rapidapi-host": "youtube-to-mp32.p.rapidapi.com",
                },
              };

              axios
                .request(options)
                .then(function (response) {
                  const mp3Url = response.data.Download_url;
                  db.Song.create({
                    name: songName,
                    artist: artistName,
                    lyrics: `${songName} - ${artistName}.lrc`,
                    mixed: mp3Url,
                  }).then(() => {
                    res.send("downloaded");
                  });
                })
                .catch(function (error) {
                  console.error(error);
                });

            } else {
              res.send("this song already existed!");
            }
          });
        });
      }
    });
});

module.exports = router;
