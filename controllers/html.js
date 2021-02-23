const router = require("express").Router();
const db = require("../models");
const YoutubeMusicApi = require("youtube-music-api");
const api = new YoutubeMusicApi();
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const path = require("path");

// const fs = require("fs");
// const ytdl = require("ytdl-core");

//Configure YoutubeMp3Downloader with your settings
const mp3Path = path.join(__dirname, "../mp3");
const YD = new YoutubeMp3Downloader({
  ffmpegPath: "/usr/local/opt/ffmpeg/bin/ffmpeg", // FFmpeg binary location
  outputPath: mp3Path, // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

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
          //   const validId = ytdl.getURLVideoID(
          //     `http://www.youtube.com/watch?v=${songResult.content[0].videoId}`
          //   );
          //   ytdl(`http://www.youtube.com/watch?v=${validId}`).pipe(
          //     fs.createWriteStream(`${song.name}.mp4`)
          //   );
          YD.download(`${songResult.content[0].videoId}, ${song.name}.mp3`);
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

module.exports = router;
