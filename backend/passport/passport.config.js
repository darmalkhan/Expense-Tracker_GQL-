import bcrypt from "bcryptjs";
import { GraphQLLocalStrategy } from "graphql-passport";
import passport from "passport";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("serialized user");
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    console.log("deserialized user");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, passport, done) => {
      try {
        const user = await User.findById({ username });
        if (!user) {
          throw new Error("invalid username or password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("invalid username or password");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
