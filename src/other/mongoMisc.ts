import dotenv from 'dotenv';
dotenv.config();

export const MONGOOSE_OPTIONS = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export const MONGOSTORE_OPTIONS = {
    mongoUrl: `${process.env.MONGO_DB}`,
    ttl: 1 * 24 * 60 * 60 
}

export function mognooseCallback(err: Error) {
    if (err) throw err
    console.info("Connected to Mongo")
}
