import { Router } from "express";
import passport from '../../middlewares/passport.mid.js';
import isAdmin from "../../middlewares/isAdmin.mid.js";
import { createLogoutTokenUtil, createTokenUtil, verifyTokenUtil } from "../../utils/token.util.js";
import { readById } from "../../data/mongo/managers/user.manager.js";

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', {session: false}), register)
sessionsRouter.post('/login', passport.authenticate('login', {session: false}) ,login)
sessionsRouter.post('/online', online)
sessionsRouter.post('/logout', logout)
sessionsRouter.post('/isadmin', isAdmin, isAdminResponse);

sessionsRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
sessionsRouter.get('/google/cb', passport.authenticate('google', { session: false}), google);


function register(req,res,next){
    try {
        const user = req.user; 
        const message = 'USER REGISTERED'
        return res.status(201).json({message, user_id: user._id})
    } catch (error) {
        return next(error);
    }
}

function login(req, res, next) {
    try {
        const message = 'USER LOGGED IN';
        const {token} = req
        const cookieOpts = {maxAge: 60*60*24, httpOnly: true, signed: true};
        return res.status(200).cookie('token', token, cookieOpts).json({message, token: token});
    } catch (error) {
        return next(error);
    }
}

async function online(req, res, next) {
    try {
        const {token} = req.headers;
        const data = verifyTokenUtil(token);
        const user = await readById(data.user_id);
        if(user){
            const message = 'USER ONLINE'
            return res.status(200).json({message, user : user._id})
        }
        const message = 'USER OFFLINE'
        return res.status(401).json({message})
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next) {
    try {
        const {token} = req.headers;
        const data = verifyTokenUtil(token);
        const user = await readById(data.user_id);
        const cookieOpts = {httpOnly: true, signed: true}
        const message = 'USER LOGGED OUT';
        req.token = createLogoutTokenUtil({user_id: user._id, role: user.role})
        return res.status(200).clearCookie("token",cookieOpts).json({message, newToken: req.token});
    } catch (error) {
        return next(error);
    }
}

async function isAdminResponse(req,res,next){
    const {token} = req.headers;
    const data = verifyTokenUtil(token);
    const user = await readById(data.user_id);
    const message = 'USER IS ADMINISTRATOR';
    return res.status(200).json({message, user: user._id});
}

async function google(req,res,next){
    try {
        const message = 'USER LOGGED IN';
        const {token} = req
        const cookieOpts = {maxAge: 60*60*24, httpOnly: true, signed: true};
        return res.status(200).cookie('token', token, cookieOpts).json({message, token: token});
    } catch (error) {
        return next(error);
    }
}

export default sessionsRouter;