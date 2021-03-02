const router = require("express").Router();
const db = require("../models");
const { createLrc } = require("./lrc.js");
const cloudinary = require("./cloudinary");
const fs = require("fs");
const path = require("path");
const YoutubeMusicApi = require("youtube-music-api");
const musicApi = new YoutubeMusicApi();
const youtubedl = require('youtube-dl');
const ffmpeg = require('ffmpeg');

// Deletes all stored songs
router.delete("/api/song/deleteAll", (req, res) => {
  db.Song.remove().then(() => {
    res.send("All songs deleted!")
  })
})

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
          const fileName = safeName + " - " + artistName;

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

              duplicateLrcErrorMessage.title = safeName;

              createLrc(safeName, artistName);

              //get mp4
              const video = youtubedl(`http://www.youtube.com/watch?v=${songResult.content[0].videoId}`,
                // Optional arguments passed to youtube-dl.
                ['--format=18'],
              )

              // write mp4
              const mp4FilePath = path.join(__dirname, `../music/mp4/test.mp4`);
              const mp4 = video.pipe(fs.createWriteStream(mp4FilePath));

              mp4.on('close', () => {
                try {
                  const process = new ffmpeg(path.join(__dirname, `../music/mp4/test.mp4`));
                  process.then((video) => {

                    //extract mp3 from mp4
                    video.fnExtractSoundToMP3(path.join(__dirname, `../music/mp3/test.mp3`), (error, file) => {
                      cloudinary.uploader.upload(file, {
                        resource_type: "video",
                        public_id: fileName,
                        folder: 'mp3',
                        use_filename: true,
                        chunk_size: 6000000,
                      }, (error, result) => {
                        const mp3Url = result.url;
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
                              res.status(500).send(err)
                            })
                        } else {
                          //if song can not be downloaded, respond with custom message
                          duplicateLrcErrorMessage.errorMessage = 'song is not available for karaoke yet'
                          res.send(duplicateLrcErrorMessage)
                        }
                      });
                    });
                  }, (err) => {
                    console.log('Error: ' + err);
                  });
                } catch (e) {
                  console.log(e.code);
                  // console.log(e.msg);
                }
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
      res.status(500).send(err)
    })
});

module.exports = router;
