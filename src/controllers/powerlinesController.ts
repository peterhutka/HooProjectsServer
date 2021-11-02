import { Response } from "express"
import { PowerLines_UserScoreInterface } from "src/Interfaces/PowerLines_UserScoreInterface"
import PowerLines_UserScore from "../Schemas/PowerLines_UserScore"


export async function getLeaderboard(req: Request, res: Response){  
    await PowerLines_UserScore.find({}, (err: Error, users: PowerLines_UserScoreInterface[]) => {
        if (err) throw err
        
        const temp: PowerLines_UserScoreInterface[] = []

        users.forEach((user: PowerLines_UserScoreInterface) => {
            temp.push({
                username: user.username,
                elo: user.elo
            })
        })
        res.json(temp)
    })
}