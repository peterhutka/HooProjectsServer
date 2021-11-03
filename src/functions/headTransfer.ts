import { cutPlayer } from "./cutPlayer";
import { endGame } from "./endGame";

export function headTransfer (
    gameInfos: any,
    roomId: any,
    pos: number,
    positionChange: number,
    id: string,
    io: any
){
    //check if room exists
    if (!gameInfos.rooms[roomId] || !gameInfos.rooms[roomId].grid ) return

    let gameEnds = false;

    
    let oldLetter: "A"|"B"|null = gameInfos.rooms[roomId].grid[pos].player
    let newLetter: "A"|"B"|null = gameInfos.rooms[roomId].grid[pos + positionChange].player
  

    if(newLetter && newLetter !== oldLetter) {
        gameEnds = cutPlayer(gameInfos, pos + positionChange, roomId, gameInfos.players[id].opponent, io)
        //if this cut ended game return
        //todo consider updating users about final grid position
        if (!gameInfos.rooms[roomId] || !gameInfos.rooms[roomId].grid ) return 
    }
    
    finishHeadMovement(positionChange, gameInfos, roomId, pos, oldLetter, id)
    if(gameEnds) endGame(gameInfos.players[id].opponent, gameInfos, io)

   
}

export function finishHeadMovement(
    positionChange: number, 
    gameInfos: any, 
    roomId: any,
    pos: number,
    oldLetter: "A" | "B" | null,
    id: string
    
    ){
    //gets indexes of sqare road array in old and new squares
    let roadIdx = (positionChange === -1) ? 0 : (positionChange === 36) ? 1 : (positionChange === 1) ? 2 : 3
    let newSqRoadIdx = positionChange === -1 ? 2 : positionChange === 36 ? 3 : positionChange === 1 ? 0 : 1
    let newHeadSqare;

    if(gameInfos.rooms[roomId]?.grid && pos){

        newHeadSqare = gameInfos.rooms[roomId].grid[pos + positionChange]
        gameInfos.rooms[roomId].grid[pos].roads[roadIdx] = true
        gameInfos.rooms[roomId].grid[pos + positionChange].roads[newSqRoadIdx] = true
    }
    let x;
    let y;
    if(newHeadSqare) {
        x = newHeadSqare.x;
        y = newHeadSqare.y
    }
    
    // handle switching of head position
    gameInfos.rooms[roomId].grid[pos].isHead = false
    gameInfos.rooms[roomId].grid[pos + positionChange].isHead = true
    gameInfos.rooms[roomId].grid[pos + positionChange].player = oldLetter;
    
    // change position of player
    gameInfos.players[id].position += positionChange;
}