import mongoose from "mongoose";

const powerLines_UserScore = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    elo: {
        type: Number
    }
})

export default mongoose.model("PowerLines_UserScore", powerLines_UserScore)