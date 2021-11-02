import { deleteUser, getAllUsersController, getUserController, isAdmin, loginController, logoutController, registerUser } from "../controllers/authenticationController";
import passport from "passport";

var express = require('express')
var router = express.Router()

router.post("/register", registerUser)
router.post("/login", passport.authenticate("local"), loginController)

router.get("/user", getUserController)
router.get("/logout", logoutController)
router.get("/getallusers", isAdmin, getAllUsersController)
router.post("/deleteuser", isAdmin, deleteUser)

module.exports = router