import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
const localStrategy = Strategy;
const logger = require("./logger").child({ module: __filename });
const User = require("./agentLogic/users");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const user = await User.getUserByEmail(email);
        if (!user) {
          return done(null, false, {
            message: "Incorrect email and/or password",
          });
        }
        try {
          if (await bcrypt.compare(password, user.password)) {
            let result = user;
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        } catch (error) {
          logger.error("Error logging in user");
          throw error;
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser((id, done) => {
    User.getUserByEmail({ user_id: id }, (err, user) => {
      const userInformation = {
        email: user.email,
      };
      done(err, userInformation);
    });
  });
};
