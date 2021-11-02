import { squareInterface } from "src/Interfaces/RoomInfoInterface";
import { createTimeHashAndStartTimer } from "./createTimeHashAndStartTimer";

export function startGame(io: any, grid: squareInterface[], idA: string, idB: string, gameInfos: any){
    io.to(idA).emit("gameStartsIn", {time: 2, bool: true})
    io.to(idB).emit("gameStartsIn", {time: 2, bool: false})
    
    gameInfos.rooms[idA + idB] = {}
    gameInfos.rooms[idA + idB].grid = grid
    gameInfos.players[idA].room = idA + idB
    gameInfos.players[idB].room = idA + idB    
    gameInfos.players[idA].timeLeft = 10000
    gameInfos.players[idB].timeLeft = 10000
    gameInfos.players[idA].opponent = idB
    gameInfos.players[idB].opponent = idA
    gameInfos.players[idA].movesTotal = 1
    gameInfos.players[idB].movesTotal = 1
    gameInfos.players[idA].movesCurrent = 1
    gameInfos.players[idB].movesCurrent = 1
    gameInfos.players[idA].bases = 1
    gameInfos.players[idB].bases = 1

    setTimeout(()=>{
        io.to(idA).emit("gameStarted", true)
        io.to(idB).emit("gameStarted", false)
        createTimeHashAndStartTimer(gameInfos, idA, io)
    }, 2000)
}