const LRC = require("lrc.js")
const fs = require("fs")

const Lrc = (filePath) => {
  fs.readFile(filePath, (err, data) => {
    let lyrics = LRC.parse(data.toString())
    console.log(lyrics.toJSON())
    return lyrics.toJSON()
  })
}

module.exports = Lrc;