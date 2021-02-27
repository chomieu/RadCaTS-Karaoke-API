const LRC = require("lrc.js");
const fs = require("fs");
const path = require("path");

const lrcParser = (filePath) => {
  fs.readFile(filePath, async (err, data) => {
    let lyrics = LRC.parse(data.toString());
    return await lyrics;
  });
};

const createLrc = (songName, artistName) => {
  const fileName = `${songName} - ${artistName}.lrc`;
  const lrcPath = path.join(__dirname, `../music/lrc/${fileName}`);
  const input = `[ti:${songName}][ar:${artistName}]`;
  fs.writeFile(lrcPath, input, (err) => console.log(err));
};

module.exports = { lrcParser, createLrc };
