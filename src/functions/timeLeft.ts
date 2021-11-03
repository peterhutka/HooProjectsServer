import { endGame } from "./endGame"

export function timeLeft (id: string, index: string, gameInfos: any, io: any){
    // if index exist it means that player didnt make a move and lost bc of time

    if(gameInfos.players[id]?.timeOutIndex === index){
        endGame(id, gameInfos, io)

        //todo - send message to players that game was ended bc of time
        //io.to(id).emit("endgame", "You Lost bc of time")
        //io.to(gameInfos.players[id].opponent).emit("endgame", "You Won bc of time")
    }
}