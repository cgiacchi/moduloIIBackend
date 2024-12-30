import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { create, readByEmail } from "../data/mongo/managers/user.manager.js";
import { createTokenUtil } from "../utils/token.util.js";
import envUtil from "../utils/env.util.js";
import { sendVerificationEmail } from "../utils/nodemailer.util.js";
import crypto from 'crypto';

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL, SECRET_KEY} = envUtil;

passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" }, 
    async(req, email, password, done)=>{
        const one = await readByEmail(email);
        if(one){
            const error = new Error('USER ALREADY REGISTERED');
            error.statusCode = 401;
            return done(error);
        }
        req.body.password = createHashUtil(password);
        let data = req.body;
        const verificationCode = crypto.randomBytes(12).toString('hex');
        data = {...data, verificationCode};
        const newUser = await create(data);
        await sendVerificationEmail(newUser.email, verificationCode);
        return done(null, newUser);

    }
));

passport.use("login", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" }, 
    async(req, email, password, done)=>{
        const user = await readByEmail(email);
        if(!user){
            const error = new Error('USER NOT FOUND');
            error.statusCode= 401;
            return done(error);
        }
        if(!user.verifiedUser){
            const error = new Error('USER MUST VERIFY MAIL FIRST');
            error.statusCode= 401;
            return done(error);
        }
        const passwordsMatch = verifyHashUtil(password, user.password);
        if(passwordsMatch){
            req.token = createTokenUtil({user_id: user._id, role: user.role});
            return done(null, user);
        }
        const error = new Error('INVALID CREDENTIALS');
        error.statusCode= 401;
        return done(error);

    }
));

passport.use("isAdmin", new JwtStrategy(
    {jwtFromRequest: ExtractJwt.fromExtractors([req=>req?.signedCookies?.token]), secretOrKey: SECRET_KEY},
    (data, done)=>{
        const userId = data.user_id;
        if(data.role != "ADMIN"){
            const error = new Error('UNAUTHORIZED');
            error.statusCode = 403;
            return done(error);
        }
        return done(null, userId);
    }
));


passport.use("google", new GoogleStrategy(
    { clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, passReqToCallback: true, callbackURL: `${API_BASE_URL}/api/sessions/google/callback`},
    async (req, accessToken, refreshToken, profile, done)=>{
        try {
            const { id, given_name, family_name } = profile;
            let user = await readByEmail(id); 
                if(!user){
                user = await create({email: id, password: createHashUtil(id), firstName : given_name, lastName : family_name});
            }
            req.token = createTokenUtil({user_id: user._id, role: user.role});
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }
));


export default passport