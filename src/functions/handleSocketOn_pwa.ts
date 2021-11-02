import { roomInfoInterface, squareInterface, waitingQueueType } from "src/Interfaces/RoomInfoInterface";
import { createMap } from "./createMap";
import { initializeGame } from "./initializeGame";
import { startGame } from "./startGame";

//pwa - Play With Anyone
// its intiation of game from client

export function handleSocketOn_pwa(
    socket:any, 
    io: any, 
    waitingQueue: waitingQueueType,  
    playersInGame: waitingQueueType,
    gameInfos: any
    
    )
{
    //if player is playing or waiting dont do anything    
    if (playersInGame[socket.id] || waitingQueue[socket.id]) {
        io.to(socket.id).emit("pwaResponse", "occupied");
        return
    }
    
    // If nobody is waiting in Queue add to queue
    if(!Object.keys(waitingQueue)[0]){
        addToQueue(socket, io, waitingQueue)
    } else {
        const opponentId = Object.keys(waitingQueue)[0];
        initializeGame(socket, io, opponentId, gameInfos);
         //cancel oponent from queue
        delete waitingQueue[opponentId]
    }
}

//player is waiting for another player to join game in queue
function addToQueue(socket: any, io:any, waitingQueue: waitingQueueType){
    waitingQueue[socket.id] = socket.id
    io.to(socket.id).emit('pwaResponse', "queued");
}



