// Set up the Express app
const express = require("express")
const logger = require("morgan")
const app = express()
app.use(logger("dev"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

// Database
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/karaoke", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// Routes
const routes = require("./controller.js")
app.use(routes)

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
});