//todo check map if opponents are connected

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';

const cookieParser = require("cookie-parser")
import session from 'express-session';
import dotenv from 'dotenv';
import { waitingQueueType} from './Interfaces/RoomInfoInterface'
import { deserializeUserController, isAdmin, localStrategyVerify, serializeUserController } from './controllers/authenticationController';
import { mognooseCallback, MONGOOSE_OPTIONS, MONGOSTORE_OPTIONS } from './other/mongoMisc';
import { ioSetup, IO_OPTIONS } from './other/ioMisc';
import { SESSION_OPTIONS } from './other/sessionMisc';
import { httpListenCallback } from './other/misc';

const LocalStrategy = passportLocal.Strategy

//routes
const authenticationRoutes  = require('./routes/authentication')
const powerlinesRoutes      = require('./routes/powerlinesRoutes')

dotenv.config();

//todo - change from variables to database 
const waitingQueue: waitingQueueType = {}
const playersInGame: waitingQueueType = {}
const gameInfos: any = {
    players: {}, 
    rooms: {}
        // rooms[id of room] - contains grid and info about room
}
const pwfLobby = {
    // [number] : contains id of waiting player
}
const matchedLobby = {
}

mongoose.connect(`${process.env.MONGO_DB}`, MONGOOSE_OPTIONS, mognooseCallback)

//Middleware
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, IO_OPTIONS);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(session(SESSION_OPTIONS));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//passport
passport.use(new LocalStrategy(localStrategyVerify)) 
passport.serializeUser(serializeUserController)
passport.deserializeUser(deserializeUserController)

//routes

app.use("/", authenticationRoutes)
app.use("/", powerlinesRoutes)

http.listen(process.env.PORT || 8080, httpListenCallback(http));
ioSetup(gameInfos, waitingQueue, playersInGame, pwfLobby, matchedLobby, io)