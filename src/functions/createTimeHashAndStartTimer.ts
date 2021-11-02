import { timeLeft } from "./timeLeft"


export function createTimeHashAndStartTimer(
    gameInfos: any,
    id: string,
    io: any

){
    //runs function timeLeft, after x seconds, x is number of seconds player has at start of round
    //creates index that is removed after player makes move
    //if index is deleted, player doesnt lose when timeLeft is run

    //nicetohave - find a better way to create index 
    const timeOutIndex = Date.now() + "" + Math.random()
    
    if(!gameInfos.players[id]){
        console.log("createTimeHashAndStart: player doesnt exist")
        return
    }

    function handleTimeLeft(){
        timeLeft(id, timeOutIndex, gameInfos, io)
    }

    gameInfos.players[id].timeOutIndex = timeOutIndex
    gameInfos.players[id].moveStarted = Date.now()
    setTimeout(() => handleTimeLeft(), gameInfos.players[id].timeLeft)
}