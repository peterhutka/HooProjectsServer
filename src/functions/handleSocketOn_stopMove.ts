import { finishRound } from "./finishRound"

export function handleSocketOn_stopMove(
    socket: any,
    io: any,
    gameInfos: any
){
    //check if room exists
    if (!gameInfos.rooms[gameInfos.players[socket.id]?.room]) return
    
    //if this is null, its not your move because it is set to value at start of every move 
    if(gameInfos.players[socket.id]?.timeOutIndex === null) return

    const roomId = gameInfos.players[socket.id].room

    if(gameInfos.players[socket.id].movesCurrent < gameInfos.players[socket.id].movesTotal){
        finishRound(gameInfos, socket.id, io, roomId)
    }
}