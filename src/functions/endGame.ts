import { changeElo } from "./changeElo"

export function endGame(
    loserId: string,
    gameInfos: any,
    io: any,
){
    const winnerId: string = gameInfos.players[loserId].opponent
    const roomId: string = gameInfos.players[winnerId].room

    if(gameInfos?.rooms[roomId]?.matched){
        const winnerUsername = gameInfos.players[winnerId].username
        const loserUsername = gameInfos.players[loserId].username
        console.log("changing ELO")
        changeElo(winnerUsername, loserUsername,)

    }

    io.to(loserId).emit("finalGridUpdate", {
        grid: gameInfos.rooms[roomId]?.grid, 
        position: gameInfos.players[loserId]?.position,
        bases: gameInfos.players[loserId]?.bases,
        opponentMovesLeft: 0,
        movesLeft: 0
    })
    io.to(winnerId).emit("finalGridUpdate", {
        grid: gameInfos.rooms[roomId]?.grid, 
        position: gameInfos.players[winnerId]?.position, 
        bases: gameInfos.players[winnerId]?.bases,
        opponentMovesLeft: 0,
        movesLeft: 0
    
    })
    
    deleteRoom(gameInfos, roomId, winnerId, loserId)


    io.to(loserId).emit("endgame", "L")
    io.to(winnerId).emit("endgame", "W")
}

export function deleteRoom(gameInfos: any, roomId: string, winnerId: string, loserId: string){
    if(gameInfos.rooms[roomId]) delete gameInfos.rooms[roomId]
    if(gameInfos.players[winnerId])delete gameInfos.players[winnerId]
    if(gameInfos.players[loserId])delete gameInfos.players[loserId]
}