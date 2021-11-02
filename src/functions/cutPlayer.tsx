import { endGame } from "./endGame";

export function cutPlayer(
    gameInfos: any,
    pos: number, // position of square that is being cut
    roomId: string,
    opponentId: string, // id of player that is being cut
    io: any // 
){
    let letter = gameInfos.rooms[roomId].grid[pos].player // leter of user that is being cut
    gameInfos.rooms[roomId].grid[pos].roads = [false, false, false, false] // reseting roads in square that is being cut

    // getting index of head of player that is being cut
    let headIndex: number | null = null;
    for(let square of gameInfos.rooms[roomId].grid){
        if(square.player === letter && square.isHead){
            headIndex = 36*square.x + square.y
            break
        }
    }
    //checking for error, should always pass if head exists
    if(headIndex === null) return true

    //basically graph traversing algorithm, traversing from head to ends of chain after the "pos" was cut resulting in shorter chain
    
    let nextSquares = [headIndex] // queue of squares that need to be visited
    let squaresExplored:number[] = [] // array of already visited squares

    while(nextSquares[0]){
        let index = nextSquares[0]

        //remove current square from queue
        nextSquares.splice(0, 1)

        //checks if square is inside field and if it is not the initial square that is being cut
        if (index < 0 || index > 1295 || pos === index) continue
        
        //if square contains road and the square at that side is not already in visited array it pushes that new square to queue "nextSquares"
        if(gameInfos.rooms[roomId].grid[index].roads[0]){
            if (!(squaresExplored.includes(index - 1))){
                nextSquares.push(index - 1)
            }
            
        }
        if(gameInfos.rooms[roomId].grid[index].roads[1]){
            if (!(squaresExplored.includes(index +36))){
                nextSquares.push(index +36)
            }
        }
        if(gameInfos.rooms[roomId].grid[index].roads[2]){
            if (!(squaresExplored.includes(index +1))){
                nextSquares.push(index +1)
            }
        }
        if(gameInfos.rooms[roomId].grid[index].roads[3]){
            if (!(squaresExplored.includes(index - 36))){
                nextSquares.push(index - 36)
            }
        }

        // marking square as explored
        squaresExplored.push(index) 
    }

    
    //counter of bases connected after cut, if 0 after update, player being cut lost
    let newBasesNumber = 0;

    for(const square of gameInfos.rooms[roomId].grid){
        let index = getIndex(square)

        //if square was owned by player that is being cut before the cut
        if (square.player === letter){
            //if the square was explored it is still in the new chain
            if(squaresExplored.includes(index)){
                //if square is type Bp, it means theres occupied based in chain even after cut
                if(gameInfos.rooms[roomId].grid[index].type === "Bp"){
                    newBasesNumber++
                }
            } else resetSqare(index) //if this runs it means this square is no longer connected to old player so it needs to be reset
                
            
        }
    }

    updateAfterCut()
    


    //nothing should run after this
    if(newBasesNumber < 1){
        //endGame(opponentId, gameInfos, io)
        //todo, consider grid update after end of game

        return true
    }
    return false




    function resetSqare(index: number){
        gameInfos.rooms[roomId].grid[index].roads = [false, false, false, false]
        gameInfos.rooms[roomId].grid[index].player = null
        if(gameInfos.rooms[roomId].grid[index].type === "Bp"){
            gameInfos.rooms[roomId].grid[index].type = "B"
        }
    }
    function updateAfterCut(){
        gameInfos.players[opponentId].bases = newBasesNumber
        gameInfos.players[opponentId].movesTotal = newBasesNumber
        gameInfos.players[opponentId].movesCurrent = newBasesNumber
    }
}

function getIndex(square: any){
    //console.log(square.x, square.y) all indexes seem to be ok
    return square.x*36 + square.y
}