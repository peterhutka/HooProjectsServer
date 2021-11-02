import { changeElo } from "./changeElo"
import { deleteRoom, endGame } from "./endGame"

export function handleDisconnect(
    id: string,
    gameInfos: any,
    io: any,
){
    //todo - consider not ending game at disconnect, wait untill time runs out
    //todo - delete lobby entries if player is disconnected 
    //todo - run win/lose mode only if room exists

    const opponent = gameInfos.players[id]?.opponent
    const roomId = gameInfos.players[opponent]?.room

    //if disconected player had less points he loses
    if(gameInfos.players[id]?.movesTotal < gameInfos.players[opponent]?.movesTotal){
        //todo - add message that game ended bc of disconnect
        //io.to(opponent).emit("endgame", "W")
        //io.to(id).emit("endgame", "L")

        //if game is matched change elos
        if(gameInfos?.rooms[roomId]?.matched){
            const winnerUsername = gameInfos.players[opponent].username
            const loserUsername = gameInfos.players[id].username
            changeElo(winnerUsername, loserUsername)
        }
        endGame(id, gameInfos, io)
    } else{
        io.to(opponent).emit("endgame", "T")
        io.to(id).emit("endgame", "T")
    }
    deleteRoom(gameInfos, roomId, opponent, id)   
}