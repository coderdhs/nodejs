const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User } = require("../models");

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: " my info - NodeBird", user: req.user });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: " Join - NodeBird",
    user: req.user,
    joinError: req.flash("joinError")
  });
});

router.get("/", (req, res, next) => {
  Post.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "nick"]
      },
      {
        model: User,
        attributes: ["id", "nick"],
        as: "Liker"
      }
    ]
  })
    .then(posts => {
      res.render("main", {
        title: "NodeBird",
        twits: posts,
        user: req.user,
        loginError: req.flash("loginError")
      });
    })
    .catch(error => {
      console.error(error);
      next(error);
    });
});

module.exports = router;
