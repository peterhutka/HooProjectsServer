import { waitingQueueType } from "src/Interfaces/RoomInfoInterface";
import { finishRound } from "./finishRound";

export function handleSocketOn_takeBase(
    socket: any,
    io: any,
    gameInfos: any,


){
    //check if room exists
    if (!gameInfos.rooms[gameInfos.players[socket.id]?.room]) return

    //if this is null, its not your move because it is set to value at start of every move 
    if(gameInfos.players[socket.id]?.timeOutIndex === null) return

    //check if player already moved because it is a rule that you can take base only if you didnt move
    if( gameInfos.players[socket.id].movesTotal !==  gameInfos.players[socket.id].movesCurrent){
        socket.to(socket.id).emit("alreadyMoved")
        return
    }

    //check if the tile is really base
    const roomId = gameInfos.players[socket.id].room
    const pos = gameInfos.players[socket.id].position

    if(gameInfos.rooms[roomId].grid[pos].type === "B"){
        gameInfos.rooms[roomId].grid[pos].type = "Bp"
        gameInfos.players[socket.id].movesTotal +=1
        gameInfos.players[socket.id].bases +=1
        finishRound(gameInfos, socket.id, io, roomId)
    }
    
}