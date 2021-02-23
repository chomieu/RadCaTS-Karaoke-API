const router = require("express").Router();
const db = require("../models");
const YoutubeMusicApi = require("youtube-music-api");
const api = new YoutubeMusicApi();
const path = require("path");
const yas = require("youtube-audio-server");
const youtubeStream = require("youtube-audio-stream");

// const YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
// var YD = new YoutubeMp3Downloader({
//   ffmpegPath: "/usr/local/bin/ffmpeg", // FFmpeg binary location
//   outputPath: "../mp3", // Output file location (default: the home directory)
//   youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
//   queueParallelism: 2, // Download parallelism (default: 1)
//   progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
//   allowWebm: false, // Enable download from WebM sources (default: false)
// });

// YD.download("Vhd6Kc4TZls", "Cold Funk - Funkorama.mp3");

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
          //   const getAudio = function (req, res) {
          //     const requestUrl =
          //       "http://youtube.com/watch?v=" + songResult.content[0].videoId;
          //     try {
          //       youtubeStream(requestUrl).pipe(res);
          //     } catch (exception) {
          //       res.status(500).send(exception);
          //     }
          //   };
          yas.downloader
            // .onSuccess(({ id, file }) => {
            //   console.log(
            //     `Yay! Audio (${id}) downloaded successfully into "${file}"!`
            //   );
            // })
            // .onError(({ id, file, error }) => {
            //   console.error(
            //     `Sorry, an error ocurred when trying to download ${id}`,
            //     error
            //   );
            // })
            .download({
              id: songResult.content[0].videoId,
              file: `${song.name}.mp3`,
            });
          res.send("downloaded");
        });
        //   } else if (artist.name && !song.name) {
        //     api.search(artist.name, artist.type).then((artistResult) => {
        //       console.log(artistResult);
        //     });
        //   } else {
        // api.search(artist.name, artist.type).then((searchResult) => {
        //   console.log(searchResult);
        //   api.getArtist(searchResult.browseId).then(artistResult => {
        //     res.json(artistResult);
        //   })
        // });
      }
    });
});

// const id = "HQmmM_qwG4k"; // "Whole Lotta Love" by Led Zeppelin.
// const file = "whole-lotta-love.mp3";
// yas.downloader.download({ id: "HQmmM_qwG4k", file: "whole.mp3" });

module.exports = router;
