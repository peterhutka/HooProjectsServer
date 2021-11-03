import { waitingQueueType } from "src/Interfaces/RoomInfoInterface";
import { createTimeHashAndStartTimer } from "./createTimeHashAndStartTimer";
import { finishRound } from "./finishRound";
import { headTransfer } from "./headTransfer";

export function handleSocketOn_move (
    socket: any,
    io: any,
    gameInfos: any,
    data: any // position change sent from client as number
){
    //check if room exists
    if (!gameInfos.rooms[gameInfos.players[socket.id]?.room]) return
    
    //check if client sent right data
    if(data != -1 && data != 1 && data !== 36 && data != -36) return

    if(!gameInfos.players[socket.id]) {
        console.log("handleSocketOn_move: player not found")
    }

    //if this is null, its not your move because it is set to value at start of every move 
    if(gameInfos.players[socket.id]?.timeOutIndex === null) return


    const roomId = gameInfos.players[socket.id].room
    let pos = gameInfos.players[socket.id].position
    let opponentPos = gameInfos.players[gameInfos.players[socket.id].opponent].position
    
    if(
        //check for borders
        (gameInfos.rooms[roomId].grid[pos].y === 0 && data === -1) ||
        (gameInfos.rooms[roomId].grid[pos].y === 35 && data === 1) ||
        (gameInfos.rooms[roomId].grid[pos].x === 0 && data === -36) ||
        (gameInfos.rooms[roomId].grid[pos].x === 35 && data === 36) 
    ){
        // todo  - recieve message on client side
        io.to(socket.id).emit("invalid", "border")
        return
    }

    // we checked the border, now lets check if the new square is free
    
    const newSqare = gameInfos.rooms[roomId].grid[pos + data]

    // if new sqare is occupied by wall or head of other player return false
    if((newSqare.isHead) || (newSqare.type === "W")){
        //this should never run bc we are checking sqare availability on client side 
        io.to(socket.id).emit("invalid", "occupied")
    } 
    else {
        headTransfer(gameInfos,roomId, pos, data, socket.id, io)
        if(!gameInfos.rooms[roomId]) return

        handleMoveCount()

        pos = gameInfos.players[socket.id].position
        const opponent = gameInfos.players[socket.id].opponent

        
        io.to(socket.id).emit("gridUpdate", {
            grid: gameInfos.rooms[roomId].grid, 
            position: pos, 
            bases: gameInfos.players[socket.id].bases,
            opponentMovesLeft: gameInfos.players[opponent].movesCurrent,
            movesLeft: gameInfos.players[socket.id].movesCurrent
        })
        io.to(opponent).emit("gridUpdate", {
            grid: gameInfos.rooms[roomId].grid, 
            position: opponentPos, 
            bases: gameInfos.players[opponent].bases,
            opponentMovesLeft: gameInfos.players[socket.id].movesCurrent,
            movesLeft: gameInfos.players[opponent].movesCurrent
            
        
        })
    }
        

    
    function handleMoveCount(){
        if(gameInfos.players[socket.id].movesCurrent === 1){
            finishRound(gameInfos, socket.id, io, roomId)
        } else {
            //decrease number of moves after 
            gameInfos.players[socket.id].movesCurrent -= 1;
        }
    }  
    
    
}

