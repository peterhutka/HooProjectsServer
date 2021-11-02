const cookieParser = require("cookie-parser")
import { NextFunction } from "express";
import passportSocketIo from "passport.socketio";
import { handleDisconnect } from "../functions/handleDisconnect";
import { handleSocketOn_move } from "../functions/handleSocketOn_move";
import { handleSocketOn_pwa } from "../functions/handleSocketOn_pwa";
import { handleSocketOn_pwf_getCode } from "../functions/handleSocketOn_pwf_getCode";
import { handleSocketOn_pwf_join } from "../functions/handleSocketOn_pwf_join";
import { handleSocketOn_pwf_matched } from "../functions/handleSocketOn_pwf_matched";
import { handleSocketOn_stopMove } from "../functions/handleSocketOn_stopMove";
import { handleSocketOn_takeBase } from "../functions/handleSocketOn_takeBase";
import { waitingQueueType } from "../Interfaces/RoomInfoInterface";
import { onAuthorizeFail, onAuthorizeSuccess } from "../controllers/authenticationController";
import { http } from "./misc";
import { sessionStore } from "./sessionMisc";
import dotenv from 'dotenv';

dotenv.config()

export const IO_OPTIONS = {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
}


export async function passportSocketIoSetup(socket: any, next: any) {
    return passportSocketIo.authorize({
        cookieParser: cookieParser,       
        key:          "key1",       // the name of the cookie where express/connect stores its session_id
        secret:       "secretcode",    // the session_secret to parse the cookie
        store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
        success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
        fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
    })(socket, next);
}

export function setSocketUsername(socket: any, next: NextFunction){
    if(!socket.username){
        socket.username = socket.request.user.username
        //console.log(`Changed socket username of id: ${socket.id} to: ${socket.username}`)
    }
    next()
}



export function ioSetup(
    gameInfos: any,
    waitingQueue: waitingQueueType,
    playersInGame: waitingQueueType,
    pwfLobby: any,
    matchedLobby: any,
    io: any
){
    

    io.use(passportSocketIoSetup)
    io.use(setSocketUsername)

    io.on('connection', function(socket: any) {
    console.info('Client connected to the WebSocket');
    
        socket.on('disconnect', () => {
            handleDisconnect(socket.id, gameInfos, io)
            console.info('Client disconnected', socket.id);
        });

        //Play with anyone - game initiation from client
        socket.on('pwa', function(data: any) {
            handleSocketOn_pwa(socket, io, waitingQueue, playersInGame, gameInfos)
        });

        socket.on("pwf_getCode", ()=>{
            handleSocketOn_pwf_getCode(socket, io, pwfLobby)
        })

        socket.on("pwf_join", (data: any)=>{
            handleSocketOn_pwf_join(socket, io, gameInfos, pwfLobby,data)
        })

        socket.on("pwa_matched", (data: any)=>{
            //fix name pwa, pwf
            handleSocketOn_pwf_matched(socket, io, gameInfos, matchedLobby)
        })
        
        socket.on('move', (data: any) => {
            handleSocketOn_move(socket, io, gameInfos, data)
        });

        socket.on('takeBase', (data: any) => {
            handleSocketOn_takeBase(socket, io, gameInfos)
        });

        socket.on("stopMove", ()=>{
            handleSocketOn_stopMove(socket, io, gameInfos)
        })
    })
}