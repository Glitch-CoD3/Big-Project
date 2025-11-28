import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createdPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getAllPlaylists,
    deletePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

// Create playlist
router.post(
    "/",
    verifyJWT,
    createdPlaylist
);

router.get("/", verifyJWT, getAllPlaylists);


router.post(
  "/:playlistId/videos/:videoId",
  verifyJWT,
  addVideoToPlaylist
);

// Remove video from playlist
router.delete(
    "/:playlistId/videos/:videoId",
    verifyJWT,
    removeVideoFromPlaylist
);

//remove playlist
router.delete(
    "/:playlistId",
    verifyJWT,
    deletePlaylist
)

export default router;
