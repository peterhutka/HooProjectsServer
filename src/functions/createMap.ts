import { squareInterface } from "src/Interfaces/RoomInfoInterface";

export function createMap  (gameInfos: any, idA:string, idB: string): squareInterface[]{
    let tempMap: squareInterface[] = [];
    let wallChance = 0.20
    let baseChance = 0.07
    let playerNum = Math.floor(Math.random()*18*12)


    for(let x = 0; x < 18; x++){
            for(let y = 0; y < 18; y++){
                let chance = Math.random()
                let isPlayer = false;
                if(playerNum === x*18+y){
                    isPlayer = true
                    chance = 0.21;
                    assignPositions(x, y)
                }
                createSquares(x, y, isPlayer, chance)   
            }
        }
    return tempMap

    function assignPositions(x: number, y: number){
        gameInfos.players[idA].position = x*36+y
        gameInfos.players[idB].position= (35-x)*36+(35-y)
        gameInfos.players[idA].lastPosition = x*36+y
        gameInfos.players[idB].lastPosition= (35-x)*36+(35-y)
    }

    function createSquares(x: number, y: number, isPlayer: boolean, chance: number){
        //creates 4 symetrical squares in each quadrant of field
        
        tempMap[x*36+y] = 
            {
                x: x,
                y: y,
                type: isPlayer ? "Bp" : chance < wallChance ? "W" : chance < (wallChance + baseChance) ? "B": "E" ,
                roads: [false, false, false, false],
                player: isPlayer ? "A" : null,
                isHead: isPlayer ? true : false
            }
                
        tempMap[(35-x)*36+y] = 
            {
                x: 35-x,
                y: y,
                type: chance < wallChance ? "W" : chance < (wallChance + baseChance) ? "B": "E" ,
                roads: [false, false, false, false],
                player: null ,
                isHead: false
            }
        
        tempMap[(x*36)+(35-y)] =
            {
                x: x,
                y: 35-y,
                type: chance < wallChance ? "W" : chance < (wallChance + baseChance) ? "B": "E" ,
                roads: [false, false, false, false],
                player: null ,
                isHead: false
            }
        
        tempMap[(35-x)*36+(35-y)] =
            {
                x: 35-x,
                y: 35-y,
                type: isPlayer ? "Bp" : chance < wallChance ? "W" : chance < (wallChance + baseChance) ? "B": "E" ,
                roads: [false, false, false, false],
                player: isPlayer ? "B" : null,
                isHead: isPlayer ? true : false
            }

    }
}