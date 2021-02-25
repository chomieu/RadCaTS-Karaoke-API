const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require(".dotenv").config();

const authenticateMe = (req) => {
  let token = false;

  if (!req.headers) {
    token = false;
  } else if (!req.headers.authorization) {
    token = false;
  } else {
    token = req.headers.authorization.split(" ")[1];
  }
  let data = false;
  if (token) {
    data = jwt.verify(token, process.env.PRIVATEKEY, (err, data) => {
      if (err) {
        return false;
      } else {
        return data;
      }
    });
  }
  return data;
};

router.post("/api/signup", (req, res) => {
  db.User.create(req.body)
    .then((newUser) => {
      newUser.save((err) => {
        throw err;
      });
      const token = jwt.sign(
        {
          username: newUser.username,
          id: newUser._id,
        },
        process.env.PRIVATEKEY,
        {
          expiresIn: "2h",
        }
      );
      return res.json({ user: newUser, token });
      // res.redirect("/login");
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/api/login", (req, res) => {
  db.User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          process.env.PRIVATEKEY,
          {
            expiresIn: "2h",
          }
        );
        return res.json({ user, token });
      } else {
        res.json({ err: "You have entered an invalid username or password!" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/", (req, res) => {
  let tokenData = authenticateMe(req);
  if (tokenData) {
    res.json(tokenData);
  } else {
    res.status(403).send("auth failed");
  }
});

module.exports = router;
