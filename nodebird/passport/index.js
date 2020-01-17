const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    // req.login시에 serializeUser호출
    done(null, user.id); // user 정보 중 id만 세션에 저장
  });

  passport.deserializeUser((id, done) => {
    // app.use(passport.initialize());
    // app.use(passport.session()); 실행시(요청이 갈때마다 매번) deserializeUser호출
    // 요청이 갈때마다 매번 실행되기때문에 효율적으로 캐싱필요(강좌참고)
    User.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followers"
        },
        {
          model: User,
          attributes: ["id", "nick"],
          as: "Followings"
        }
      ]
    })
      .then(user => done(null, user)) // 세션에 저장된 id로 부터 다시 완전한 user정보 객체를 만듦 -> req.user
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};
