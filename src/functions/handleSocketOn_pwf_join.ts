import { initializeGame } from "./initializeGame";

export function handleSocketOn_pwf_join(
    socket:any, 
    io: any, 
    gameInfos: any,
    pwfLobby: any,
    data: any
){
    if(!pwfLobby[data]) return
    const opponentId = pwfLobby[data]
    initializeGame(socket, io, opponentId, gameInfos);
    delete pwfLobby[data]
}