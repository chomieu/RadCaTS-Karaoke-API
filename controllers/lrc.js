const LRC = require("lrc.js");
const fs = require("fs");
const path = require("path");

// Parsing lrc reference
const lrcParser = (lyricsArr) => {
  // fs.readFile(filePath, async (err, data) => {
  let lyrics = LRC.parse(lyricsArr.toString());
  return JSON.stringify(lyrics);
  // });
};

const createLrc = (songName, artistName) => {
  const fileName = `${songName} - ${artistName}.lrc`;
  const lrcPath = path.join(__dirname, `../lrc/${fileName}`);
  const input = `[ti:${songName}]\n[ar:${artistName}]`;
  fs.writeFile(lrcPath, input, (err) => console.log(err));
};

module.exports = { lrcParser, createLrc };
