const router = require("express").Router();
const db = require("../models");
const YoutubeMusicApi = require("youtube-music-api");
const api = new YoutubeMusicApi();
const yas = require("youtube-audio-server");

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
        api.search(song.name, song.type).then(async (songResult) => {
          yas.downloader
            .onSuccess(({ id, file }) => {
              console.log(
                `Yay! Audio (${id}) downloaded successfully into "${file}"!`
              );
            })
            .onError(({ id, file, error }) => {
              console.error(
                `Sorry, an error ocurred when trying to download ${id}`,
                error
              );
            })
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
