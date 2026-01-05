import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
    
} from "../controllers/like.controller.js";


const router = Router();


router.post("/:videoId/toggle-like", verifyJWT, toggleVideoLike);
router.post("/tweets/:tweetId/toggle-like", verifyJWT, toggleTweetLike);
router.get("/liked-videos", verifyJWT, getLikedVideos);


export default router; 