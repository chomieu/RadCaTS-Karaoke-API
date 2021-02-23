const router = require("express").Router();
const db = require("../models");

router.post("/api/signup", (req, res) => {
  db.User.create(req.body)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/api/login", (req, res) => {
  db.User.findOne(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch(() => {
      res.json({ err: "You have entered an invalid username or password!" });
    });
});

module.exports = router;
