import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getVideoComments,
    addComment,
    editComment,
    deleteComment,
    replyToComment,
    toggleLikeComment,
} from "../controllers/comment.controller.js";


const router = Router();



router.get("/:videoId/comments", getVideoComments);
router.post("/:videoId/comments", verifyJWT, addComment);
router.patch("/:videoId/comments/:commentId", verifyJWT, editComment);
router.delete("/:videoId/comments/:commentId", verifyJWT, deleteComment);
router.post("/:videoId/comments/:commentId/reply", verifyJWT, replyToComment);
router.post("/:videoId/comments/:commentId/toggle-like", verifyJWT, toggleLikeComment);

export default router; 