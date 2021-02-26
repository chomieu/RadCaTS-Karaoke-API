const router = require("express").Router();
const db = require("../models");
const axios = require("axios").default;
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const { lrcParser, createLrc } = require("./lrc.js");
const fs = require("fs");
const path = require("path");

const Mp3 = (videoId) => {
  const options = {
    method: 'GET',
    url: 'https://youtube-to-mp32.p.rapidapi.com/yt_to_mp3',
    params: { video_id: videoId },
    headers: {
      'x-rapidapi-key': '5d41389558mshc739796a61beb69p102c43jsn1612f6aaee40',
      'x-rapidapi-host': 'youtube-to-mp32.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    return response.data.Download_url
  }).catch(function (error) {
    console.error(error);
  });
}

// // 2 ways to create custom karaoke:
// // 1. User search and download through us, then edit the lrc file
// // 2. (Bonus) User drop mp3 & lrc, then we upload up Cloudinary and add the URL to database 

// // Create karaoke
// // Input: song name  Input: artist name
// // song name - artist name

router.get("/api/download", (req, res) => {
  console.log("Req.body==============", req.body)
  musicApi
    .initalize() // Retrieves Innertube Config
    .then(() => {
      if (req.body.name.trim() !== "") {
        res.json({ err: "Please enter a valid input." });
      } else {
        musicApi.search(req.body.name).then((songResult) => {
          console.log("Song Result==============", songResult)
          const songName = songResult.content[0].name.toLowerCase();
          const artistName = songResult.content[0].artist.name.toLowerCase();
          fs.readdir(path.join(__dirname, "../music/lrc"), (err, data) => {
            if (data.indexOf(`${songName} - ${artistName}.lrc`) === -1) {
              createLrc(songName, artistName);
              const lrcObj = lrcParser(path.join(__dirname, `../music/lrc/${songName} - ${artistName}.lrc`))
              db.Song.create({
                name: songName,
                artist: artistName,
                lyrics: JSON.stringify(lrcObj),
                mixed: Mp3(songResult.content[0].videoId)
              }).then(() => {
                console.log("downloaded")
                res.send("downloaded");
              })
            } else {
              res.send("this song already existed!")
            }
          });
        });
      }
    });
});

module.exports = router;
