const YoutubeMp3Downloader = require("youtube-mp3-downloader");
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

module.exports = Mp3;
