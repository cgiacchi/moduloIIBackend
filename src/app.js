import express from 'express';
import config from './config.js';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import { Server } from "socket.io";



const app = express();

const httpServer = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);

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

    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    app.use('api/products', productsRouter);
    app.use('api/carts', cartsRouter);
    app.use('/views', viewsRouter);
    app.use('/static', express.static(`${config.DIRNAME}/public`));     

    console.log(`Listening on port ${config.PORT} conected to bbdd`);
});
