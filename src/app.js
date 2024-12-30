import dotenv from 'dotenv';
    dotenv.config();

import express from 'express';
import config from './config.js';
import envUtil from "./src/utils/env.util.js"
import mongoose from 'mongoose';
import MongoStore from "connect-mongo"
import cookieParser from 'cookie-parser'
import { Server } from "socket.io";
import morgan from "morgan"
import session from "express-session"
import pathHandler from "./middlewares/pathHandler.mid.js"
import errorHandler from "./middlewares/errorHandler.mid.js"
import indexRouter from "./routes/index.router.js"
import dbConnect from "./utils/dbConnect.util.js"
import homeRouter from './routes/home.router.js';
import viewsRouter from './routes/api/views.api.js';
import handlebars from 'express-handlebars'
import argsUtil from "./src/utils/args.util.js";

const {PORT, MONGO_REMOTE_URI, COOKIES_SECRET, MONGO_LOCAL_URI} = envUtil;

const app = express();

const httpServer = app.listen(process.env.PORT, async () => {
    console.log("server ready on port "+ process.env.PORT);
    dbConnect()
    app.listen(process.env.PORT, ready)});

    const socketServer = new Server(httpServer);
    app.set('socketServer', socketServer);



    socketServer.on("connection", (socket) => {
    socket.on("update_ok", (data) => {
    console.log("update");
    console.log(data);
    socketServer.emit("new_data", data);
    });
});

    app.use(express.json());
    app.use(express.urlencoded({ extended:true }));
    app.use(cookieParser(process.env.SECRET_KEY,))
    app.use(express.static("public"))
    
    app.use(morgan("dev"))
    app.use(session({
        secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true,
        store: new MongoStore({ mongoUrl: process.env.MONGO_LINK, ttl: 60*60*24 })
    }))


    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('/views', viewsRouter);
    app.use('/', homeRouter);
    app.use('/static', express.static(`${config.DIRNAME}/public`));     
    app.use(indexRouter)
    app.use(errorHandler)
    app.use(pathHandler)