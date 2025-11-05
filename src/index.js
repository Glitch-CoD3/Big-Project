import dotenv from 'dotenv'
import { connectDB } from "./db/database.js";

dotenv.config({
    path: "/.env"
})

connectDB()    //call MongoDB from db folder
.then(()=>{
    app.listen( process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port : ${process.env.PORT || 8000}`);
        
        app.on("error", (err)=>{
            console.log("Server failed to start", err.message);
        })
    } );
})
.catch( (err)=>{
    console.log("MongoDB connection failed", err.message)
} )