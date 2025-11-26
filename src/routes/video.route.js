import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getAllvideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishVideo
} from "../controllers/video.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getAllvideos);
router.route("/upload").post(verifyJWT, upload.single("video"), publishVideo);
router.route("/:videoId").get(verifyJWT, getVideoById);
router.route("/:videoId").patch(verifyJWT, updateVideo);
router.route("/:videoId").delete(verifyJWT, deleteVideo);
router.route("/:videoId/toggle-publish").post(verifyJWT, togglePublishVideo);


export default router;