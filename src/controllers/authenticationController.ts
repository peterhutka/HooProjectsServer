import { NextFunction, Request, Response } from "express";
import { DatabaseUserInterface, UserInterface } from "src/Interfaces/UserInterface";
import User from "../Schemas/User";
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';

// registering, loggin in, login oug
export async function registerUser(req: Request, res: Response){
    const { username, password } = req?.body

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.send("improper values")
        return
    }

    User.findOne({ username }, async (err: Error, doc: DatabaseUserInterface) => {
        if (err) throw err;
        if (doc) res.send("User already exists")

        if (!doc) {
            const hashedPassword = await bcrypt.hash(req?.body.password, 10)
            const newUser = new User({
                username: req?.body.username,
                password: hashedPassword
            })
            await newUser.save()
            res.send("success")
        } else {
            res.send("user already exists")
            //todo, recieve message on client side
        }

        
    })
}

export function loginController(req: Request, res: Response) {
    console.log("loggin in")
    res.send("success")
}
export function getUserController(req: Request, res: Response){
    console.log("user", req.user)
    res.send(req.user)
}
export function logoutController(req: Request, res: Response) {
    req.logout()
    res.send("logged out")
}
export async function getAllUsersController(req: Request, res: Response){
    await User.find({}, (err: Error, data: DatabaseUserInterface[]) => {
        if (err) throw err
        const filteredUsers: UserInterface[] = [];
        data.forEach((item: DatabaseUserInterface) => {
            const UserInformation = {
                id: item._id,
                username: item.username,
                isAdmin: item.isAdmin
            }
            filteredUsers.push(UserInformation)
        })
        res.send(filteredUsers)
    })
}


// passport controllers

export function deserializeUserController(id: string, done: any) {
    User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
        const userInformation: UserInterface = {
            username: user.username,
            isAdmin: user.isAdmin,
            id: user._id
        }
        done(err, userInformation)
    })
}

export function serializeUserController(user: DatabaseUserInterface, done: any) {
    done(null, user._id)
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
    const {user} : any = req;
    if (user) {
        User.findOne({username: user.username}, (err: Error, doc: DatabaseUserInterface) => {
            if (err)  throw err
            if (doc?.isAdmin){
                next()
            } else res.send("not admin")
        })
    } else res.send("no user logged in")
}

export async function deleteUser(req: Request, res: Response) {
    const {id} = req?.body
    await User.findByIdAndDelete(id,{}, (err) => {
        if (err) throw err
    })
    res.send("success")
}

export function localStrategyVerify(username: string, password: string, done:any ) {
    User.findOne({ username: username }, (err: Error, user: DatabaseUserInterface) => {
        if (err) throw err
        if (!user) return done(null, false)
        bcrypt.compare(password, user.password, (err, result: boolean) => {
            if (err) throw err
            if (result === true) return done(null, user)
            else return done(null, false)
        })
    })
}

export function onAuthorizeSuccess(data: any, accept: any){
  accept()  
}

export function onAuthorizeFail(data: any, message: any, error: any, accept: any){
    if(error) {
        console.log(" ER " , error)
        //throw error
    }
    return accept();
}

