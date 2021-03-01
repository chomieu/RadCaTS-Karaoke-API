// Set up the Express app
const express = require("express");
const logger = require("morgan");
const app = express();
const cors = require("cors");

// Socket.io stuff
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, "public")))
// Run when client connects
io.on("connection", socket => {
  console.log("new WS connection")
  socket.emit("message", "welcome to chat") // to a single client when they join
  // Broadcase when a user connects
  socket.broadcast.emit("message", "user has joins the chat") // to all but the client
  
  socket.on("disconnect", ()=> {
    io.emit("message", "user has left the chat") // to everyone in general
  })

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg)
  })

  socket.on("audioSrc", (source) => {
    io.emit("message", source)
    var audio = document.createElement("audio")
    audio.src = source
    audio.play()
  })
})


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/karaoke", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// User Routes
const userRoutes = require("./controllers/user");
app.use(userRoutes);

// HTML Routes
const htmlRoutes = require("./controllers/html");
app.use(htmlRoutes);

// Mp3 Routes
const mp3Routes = require("./controllers/mp3");
app.use(mp3Routes);

// Session Routes
const sessionRoutes = require("./controllers/session");
app.use(sessionRoutes);

// Server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => { // Changed from app.listen to server.listen for socket.io
  console.log(`http://localhost:${PORT}`);
});
