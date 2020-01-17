const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // urlencoded 미들웨어가 해석한 req.body의 값들이
        passwordField: "password" // usernameField, passwordField에 연결
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "password is not correct" });
            }
          } else {
            done(null, false, { message: "plz join" });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
