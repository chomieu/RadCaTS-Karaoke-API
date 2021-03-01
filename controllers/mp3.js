const router = require("express").Router();
const db = require("../models");
const axios = require("axios").default;
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const { createLrc } = require("./lrc.js");
const fs = require("fs");
const path = require("path")

// Deletes all stored songs
router.delete("/api/song/deleteAll", (req, res) => {
  db.Song.remove().then(() => {
    res.send("All songs deleted!")
  })
})

router.post("/api/download", (req, res) => {
  musicApi
    .initalize() // Retrieves Innertube Config
    .then(() => {
      if (!req.body.name) {
        res.json({ err: "Please enter a valid input." });
      } else {
        musicApi.search(`${req.body.name} original song`, "song").then((songResult) => {

          console.log(19, songResult.content[0])

          const songName = songResult.content[0].name.toLowerCase();
          const artistName = songResult.content[0].artist.name.toLowerCase();

          fs.readdir(path.join(__dirname, "../lrc"), (err, data) => {

            const duplicateLrcErrorMessage = {
              title: songName,
              artist: artistName,
              errorMessage: 'this song already existed!'
            }

            if (data.indexOf(`${songName} - ${artistName}.lrc`) === -1) {

              // bug: user search "let it go original"
              // musicApi response for song name  - 'Let It Go (From "Frozen"/Soundtrack Version)'
              // the '/' causes an issue for createLrc() filepath
              // split on the unwanted characters and join with single space to remove unwanted characters


              let safeName = songName
              safeName = safeName.split('/').join(' ')
              duplicateLrcErrorMessage.title = safeName

              createLrc(safeName, artistName);
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
                  console.log(53, response.data)// see below
                  // 55 {
                  //   Status: 'Fail',
                  //   Status_Code: 103,
                  //   Warining: 'Video Id Maybe Invalid Or Retry Again May Work'
                  // }
                  const mp3Url = response.data.Download_url;
                  // added-sjf conditional to check if mp3Url exists to avoid db.Song.create failure.
                  if (mp3Url) {
                    db.Song.create({
                      name: songName,
                      artist: artistName,
                      // added-sjf updated to match lrc file name 
                      lyrics: `${safeName} - ${artistName}.lrc`,
                      mixed: mp3Url,
                    }).then(() => {
                      res.send("downloaded");
                    })
                      // added-sjf
                      .catch(err => {
                        console.log(67)
                        res.status(500).send(err)
                      })
                  } else {
                    //if song can not be downloaded, respond with custom message
                    duplicateLrcErrorMessage.errorMessage = 'song is not available for karaoke yet'
                    res.send(duplicateLrcErrorMessage)
                  }
                })
                .catch(function (error) {
                  console.error(error)
                  // added-sjf
                  res.status(500).send(err)
                });
            } else {
              res.send(duplicateLrcErrorMessage);
            }
          });
        });
      }
    })
    // added-sjf
    .catch(err => {
      console.log(84)
      res.status(500).send(err)
    })
});

module.exports = router;
