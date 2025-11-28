import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

//middleware to parse json and urlencoded data
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))


//setup cors middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())


//import routes
import userRoutes from './routes/user.routes.js';
import videoRouter from "./routes/video.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"





app.use("/api/v1/users", userRoutes)
app.use("/api/v1/playlists", playlistRoutes)  // put this before :videoId
app.use("/api/v1/", videoRouter)
app.use("/api/v1/:videoId/", commentRoutes);



export { app }