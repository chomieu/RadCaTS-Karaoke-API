// Set up the Express app
const express = require("express");
const logger = require("morgan");
const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));

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

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});