import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { create, readByEmail, readById, update, } from "../data/mongo/managers/user.manager.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { createTokenUtil, verifyTokenUtil } from "../utils/token.util.js";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL } = process.env;

passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email", },
      async (req, email, password, done) => {
      try {
        const one = await readByEmail(email);
        if (one) {
          const info = { message: "user already exists", statusCode: 401 };
          return done(null, false, info);
        }
        const hashedPassword = createHashUtil(password);
        const user = await create({
          email,
          password: hashedPassword,
          name: req.body.name || "default name",
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use("login", new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
        try {
            const user = await readByEmail(email);
            if (!user) {
                const error = new Error("Invalid password")
                error.statusCode = 401
                return done(error)
            }
            const dbPassword = user.password
            const verify = verifyHashUtil(password, dbPassword)
            if (!verify) {
                const error = new Error("Invalid password")
                error.statusCode = 401
                return done(error)
            }
            //req.session.role = one.role
            //req.session.user_id = one._id
            req.token = createTokenUtil({ role: user.role, user_id: user._id})
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
));

passport.use("online", new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.SECRET_KEY,
    }, async (data, done) => {
      try {
        const { user_id } = data;
        const user = await readById(user_id);
        const { isOnline } = user;
        if (!isOnline) {
          const info = { message: "user is offline", statusCode: 401 };
          return done(null, false, info);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use("current", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
    secretOrKey: process.env.SECRET_KEY,
  }, async (data, done) => {
    try {
      const { user_id } = data;
      const user = await readById(user_id);
      const { isOnline } = user;
      if (!isOnline) {
        const info = { message: "user is offline", statusCode: 401 };
        return done(null, false, info);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
)
);

passport.use("signout", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
    secretOrKey: process.env.SECRET_KEY,
    }, async (data, done) => {
      try {
        const { user_id } = data;
        await update(user_id, { isOnline: false });
        return done(null, { user_id: null });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use("google", new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      passReqToCallback: true,
      callbackURL: BASE_URL + "sessions/google/cb",
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        const { id, picture } = profile;
        let user = await readByEmail(id);
        if (!user) {
        user = await create({
        email: id,
        photo: picture,
        password: createHashUtil(id),
        });
        }
        req.headers.token = createTokenUtil({
        role: user.role,
        user: user._id,
        });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;