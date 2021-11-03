import { PowerLines_UserScoreInterface } from "src/Interfaces/PowerLines_UserScoreInterface"
import PowerLines_UserScore from "../Schemas/PowerLines_UserScore"

export async function changeElo(winnerUsername: string, loserUsername: string){
    // get users from powerlines elo database
    let winnerQuery = await PowerLines_UserScore.findOne({ username: winnerUsername }, (err: Error) => {
        if (err) throw err              
    })
    let loserQuery = await PowerLines_UserScore.findOne({ username: loserUsername}, (err: Error) => {
        if (err) throw err   
    })

    //execute this code after queries are done
    Promise.all([winnerQuery, loserQuery]).then(async (values)=>{
        let winnerElo: number = values[0].elo
        let loserElo:  number = values[1].elo

        if(!winnerElo || !loserElo){
            console.log("something went wrong with elo change", winnerElo, loserElo)
            return
        }

        //Elo algorithm updates winnerElo and loserElo
        const winnerProbability = winnerElo / (winnerElo + loserElo)
        const loserProbability = loserElo / (winnerElo + loserElo)
        const difference = Math.max(Math.abs(winnerElo - loserElo)/3, 50)        
        const newWinnerElo = Math.round(winnerElo + difference * (1 - winnerProbability))
        const newLoserElo = Math.round( loserElo  + difference * (0 - loserProbability))

        console.log("old ELO", winnerElo, loserElo)
        console.log("new ELO", newWinnerElo, newLoserElo)

        // update users in powerlines Elo database with new values
        await PowerLines_UserScore.findOneAndUpdate({username: winnerUsername},  {elo: newWinnerElo});
        await PowerLines_UserScore.findOneAndUpdate({username: loserUsername},  {elo: newLoserElo});
    })
}