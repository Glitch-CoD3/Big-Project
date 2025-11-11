import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

export const connectDB = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(
            `\n✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`
        );

    } catch (err) {
        console.log('MongoDB connection error:', err.message);
        process.exit(1); // Exit the app if DB connection fails
    }
}




















//we can directly use it in main index.js file
/* 
import mongoose from 'mongoose'
import {DB_NAME} from './constants';

import express from 'express'
const app=express();

( async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("ERROR :", (error)=>{
            console.log("error: ",error)
            throw err
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is runnig on port ${process.env.PORT}`);
        })

    } catch(error) {
        console.error("ERROR: " , error)
        throw err
    }
} )()
*/