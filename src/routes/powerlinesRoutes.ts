import { deleteUser, getAllUsersController, getUserController, isAdmin, loginController, logoutController, registerUser } from "../controllers/authenticationController";
import { getLeaderboard } from "../controllers/powerlinesController";

var express = require('express')
var router = express.Router()

router.get("/leaderboard", getLeaderboard)

module.exports = router