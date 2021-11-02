import { squareInterface } from "src/Interfaces/RoomInfoInterface"
import { createMap } from "./createMap"
import { startGame } from "./startGame"

export function initializeGame(
    socket: any, 
    io:any, 
    opponentId: string,
    gameInfos: any
    )
{    
    gameInfos.players[socket.id] = {}
    gameInfos.players[opponentId] = {}
    
    let tempMap: squareInterface[] = createMap(gameInfos, socket.id,opponentId )
    
    // send msg to player and opponent
    io.to(socket.id).emit("mapInitialized", {grid: tempMap, info: {player: "A"}})
    io.to(opponentId).emit("mapInitialized", {grid: tempMap, info: {player: "B"}})
       
    startGame(io, tempMap, socket.id, opponentId, gameInfos )
}