import { createTimeHashAndStartTimer } from "./createTimeHashAndStartTimer";

export function finishRound(
    gameInfos: any,
    id: string,
    io: any,
    roomId: any
){
    //reset number of moves if this is the last move
    gameInfos.players[id].movesCurrent = gameInfos.players[id].movesTotal

    //reset the timeOutIndex so that timeLeft function that ends the game doesnt run
    gameInfos.players[id].timeOutIndex = null;

    //decrease amount of time player has
    const timeSpent = Date.now() - gameInfos.players[id].moveStarted
    gameInfos.players[id].timeLeft -= timeSpent
    gameInfos.players[id].timeLeft += 2000 + gameInfos.players[id].bases * 500
    gameInfos.players[id].moveStarted = null

    gameInfos.players[id].lastPosition = gameInfos.players[id].position

    //


    //let players know
    let opponent = gameInfos.players[id].opponent
    createTimeHashAndStartTimer(gameInfos, opponent, io)
    io.to(id).emit("roundDone", {
        time: gameInfos.players[id].timeLeft, 
        opponentTime: gameInfos.players[opponent].timeLeft, 
        moves: {
            player: gameInfos.players[id].movesTotal, 
            opponent: gameInfos.players[opponent].movesTotal
        }})
    io.to(opponent).emit("roundStarts", {
        time: gameInfos.players[opponent].timeLeft, 
        opponentTime: gameInfos.players[id].timeLeft, 
        moves: {
            player: gameInfos.players[opponent].movesTotal, 
            opponent: gameInfos.players[id].movesTotal
        }})



    
    io.to(id).emit("gridUpdate", {
        grid: gameInfos.rooms[roomId].grid, 
        position: gameInfos.players[id].position, 
        bases: gameInfos.players[id].bases, 
        opponentMovesLeft: gameInfos.players[opponent].movesCurrent,
        movesLeft: gameInfos.players[id].movesCurrent
    })
    io.to(opponent).emit("gridUpdate", {
        grid: gameInfos.rooms[roomId].grid, 
        position: gameInfos.players[opponent].position, 
        bases: gameInfos.players[opponent].bases,
        opponentMovesLeft: gameInfos.players[id].movesCurrent,
        movesLeft: gameInfos.players[opponent].movesCurrent
    })

    
}