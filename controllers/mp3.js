const router = require("express").Router();
const db = require("../models");
const cloudinary = require("./cloudinary");
const fs = require("fs");
const path = require("path");
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg');

//Download song
router.post("/api/download", (req, res) => {
  musicApi
    .initalize() // Retrieves Innertube Config
    .then(() => {
      if (!req.body.name) {
        res.json({ err: "Please enter a valid input." });
      } else {
        musicApi.search(`${req.body.name} original song`, "song").then((songResult) => {
          const songName = songResult.content[0].name.toLowerCase();
          const safeName = songName.split('/').join(' ');
          const artistName = songResult.content[0].artist.name.toLowerCase();

          db.Song.findOne({ name: safeName, artist: artistName })
            .then(oneSong => {
              if (oneSong) {
                res.send("This song already existed!")
              } else {
                //get and write mp4
                const mp4FilePath = path.join(__dirname, `../music/mp4/test.mp4`);
                const mp4 = ytdl(`http://www.youtube.com/watch?v=${songResult.content[0].videoId}`).pipe(fs.createWriteStream(mp4FilePath))

                mp4.on('close', () => {
                  try {
                    const process = new ffmpeg(path.join(__dirname, `../music/mp4/test.mp4`));
                    process.then((video) => {
                      //extract mp3 from mp4
                      video.fnExtractSoundToMP3(path.join(__dirname, `../music/mp3/test.mp3`), (error, file) => {
                        cloudinary.uploader.upload(file, {
                          resource_type: "video",
                          public_id: `${safeName} - ${artistName}`,
                          folder: 'mp3',
                          use_filename: true,
                          chunk_size: 6000000,
                        }, (error, result) => {
                          const mp3Url = result.url;
                          if (mp3Url) {
                            db.Song.create({
                              name: songName,
                              artist: artistName,
                              mixed: mp3Url,
                            }).then(() => {
                              res.send("downloaded");
                            }).catch(err => {
                              res.status(500).send(err)
                            })
                          } else {
                            res.send("The mp3 for this song is unavailable.")
                          }
                        });
                      });
                    }, (err) => {
                      console.log('Error-ffmpeg: ' + err);
                      res.send("Error-ffmpeg", err);
                    });
                  } catch (err) {
                    console.log("Error-mp4", err);
                    res.send("Error-mp4", err);
                  }
                });
              }
            }).catch(err => {
              console.log("Error-Onesong", err);
              res.send("Error-Onesong", err);
            })
        });
      }
    })
    .catch(err => {
      console.log("Error-Search", err);
      res.send("Error-Search", err);
    })
});

module.exports = router;
