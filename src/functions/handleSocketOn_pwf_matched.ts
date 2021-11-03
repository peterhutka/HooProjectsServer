import { PowerLines_UserScoreInterface } from "src/Interfaces/PowerLines_UserScoreInterface"
import PowerLines_UserScore from "../Schemas/PowerLines_UserScore"
import { initializeGame } from "./initializeGame"

export async function handleSocketOn_pwf_matched(
    socket:any, 
    io: any, 
    gameInfos: any,
    matchedLobby: any
){
    const id = socket.id

    //if nobody waits to play matched game
    if(Object.keys(matchedLobby).length === 0){
        addToMatchedLobby()
    } else {
        // todo, ensure player doesnt only gets elo against one player
        if(!socket.username || !matchedLobby[Object.keys(matchedLobby)[0]].username) return

        const userUsername = socket.username
        const opponentUsername = matchedLobby[Object.keys(matchedLobby)[0]].username
        const opponentId = matchedLobby[Object.keys(matchedLobby)[0]].id
        

        if(opponentId === socket.id) return 
        
        initializeGame(socket, io, opponentId, gameInfos);   

        let elo1, elo2;
        console.log("Here")

        await PowerLines_UserScore.findOne({ username: socket.username }, async (err: Error, user: PowerLines_UserScoreInterface) => {
            if (err) throw err
            if (!user) {
                const newUserElo = new PowerLines_UserScore({
                    username: userUsername,
                    elo: 1000
                })
                elo1 = 1000;
                await newUserElo.save()
            } else {
                elo1 = user.elo
            }
            
        })
        await PowerLines_UserScore.findOne({ username: matchedLobby[Object.keys(matchedLobby)[0]].username }, async (err: Error, user: PowerLines_UserScoreInterface) => {
            if (err) throw err
            if (!user) {
                const newUserElo = new PowerLines_UserScore({
                    username: opponentUsername,
                    elo: 1000
                })
                elo2 = 1000;
                await newUserElo.save()
            } else {
                elo2 = user.elo
            }

        })

        const roomId = gameInfos.players[socket.id].room
        gameInfos.rooms[roomId].matched = true
        gameInfos.players[socket.id].username = socket.username
        gameInfos.players[opponentId].username = opponentUsername


        console.log("ELODATA", elo1, elo2)
        
        io.to(socket.id).emit("rankedInfo", {name: opponentUsername, elos: [elo1, elo2]})
        io.to(opponentId).emit("rankedInfo", {name: socket.username, elos: [elo2, elo1]})

        delete matchedLobby[Object.keys(matchedLobby)[0]]



    }




    function addToMatchedLobby(){
        //assigns player to matched lobby
        matchedLobby[id] = {
            id,
            username: socket.username
        }

        // deletes room after 5 minuts after creating it to prevent inactive lobby rooms
        // todo notify about room end
        setTimeout(()=>{
            if(matchedLobby[id]) delete matchedLobby[id]
        }, 1000 * 60 * 5)
    }
    
}