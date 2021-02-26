const router = require("express").Router();
const db = require("../models");
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { lrcParser, createLrc } = require("./lrc.js");
const fs = require("fs");
const path = require("path");

const mp3Path = path.join(__dirname, "../music/mp3");
const YD = new YoutubeMp3Downloader({
  ffmpegPath: "/usr/local/opt/ffmpeg/bin/ffmpeg", // FFmpeg binary location
  outputPath: mp3Path, // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

const Mp3 = (videoId, songName, artistName) => {
  YD.download(`${videoId}`, `${songName} - ${artistName}.mp3`);
};

// 2 ways to create custom karaoke:
// 1. User search and download through us, then edit the lrc file
// 2. (Bonus) User drop mp3 & lrc, then we upload up Cloudinary and add the URL to database 

// Create karaoke
// Input: song name  Input: artist name
// song name - artist name

router.get("/api/download", (req, res) => {
  const { artist, song } = req.body;
  musicApi
    .initalize() // Retrieves Innertube Config
    .then((info) => {
      if (!artist && !song) {
        res.json({ err: "Please enter a valid input." });
      } else if (!artist && song) {
        musicApi.search(song.name, song.type).then((songResult) => {
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
        musicApi.search(artist.name, artist.type).then((artistResult) => {
          console.log(artistResult);
        });
      } else {
        musicApi.search(artist.name, artist.type).then((searchResult) => {
          console.log(searchResult);
          musicApi.getArtist(searchResult.browseId).then((artistResult) => {
            res.json(artistResult);
          });
        });
      }
    });
});

// lrcParser(path.join(__dirname, "../music/lrc/Baby Shark - Pink Fong.lrc"))

module.exports = router;
