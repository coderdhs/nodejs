const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { User } = require("../models");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash("joinError", "already joined email");
      return res.redirect("/join");
    }
    console.time("bcrypt time");
    const hash = await bcrypt.hash(password, 12);
    console.timeEnd("bcrypt time");
    await User.create({
      email,
      nick,
      password: hash
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // done(error, sucess, fail이 전달됨)
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash("loginError", info.message);
      return res.redirect("/");
    }
    return req.login(user, loginError => {
      // req.user
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(); // 다른 세션도 같이 지워지기 때문에 안 하는게..
  res.redirect("/");
});

module.exports = router;
