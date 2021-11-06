import MongoStore from "connect-mongo";
import { MONGOSTORE_OPTIONS } from "./mongoMisc";

export const sessionStore: MongoStore = MongoStore.create(MONGOSTORE_OPTIONS)


//todo put secret to .env
export const SESSION_OPTIONS =
{
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    /*name: "key1",*/
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 1,
        httpOnly: true,
        sameSite: "none"
        }
}
/*

cookie: {
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 1,
            httpOnly: true,
            sameSite: 'none'
        },
        
        */