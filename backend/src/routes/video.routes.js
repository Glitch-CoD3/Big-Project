import { Router } from 'express';
import { Video } from "../models/video.models.js";


import {
    deleteVideo,
    getAllvideos,
    getVideoById,
    publishVideo,
    togglePublishVideo,
    updateVideo,
} from "../controllers/video.controller.js"


import { verifyJWT } from "../middlewares/auth.middleware.js"

// Import multer middleware for file uploads
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();

// Apply JWT verification middleware to all routes in this file
router.use(verifyJWT);


router
    .route("/")
    .get(getAllvideos) // GET /api/v1/videos -> get all videos
    .post(
        // POST /api/v1/videos -> publish a video with files
        upload.fields([
            {
                name: "videoFile", // video file field name
                maxCount: 1,
            },
            {
                name: "thumbnail", // thumbnail file field name
                maxCount: 1,
            },
        ]),
        publishVideo // controller to handle publishing
    );

// Routes for a specific video by ID
router
    .route("/:videoId")
    .get(getVideoById) // GET /api/v1/videos/:videoId -> get a single video
    .delete(deleteVideo) // DELETE /api/v1/videos/:videoId -> delete a video
    .patch(
        upload.single("thumbnail"), // PATCH /api/v1/videos/:videoId -> update thumbnail
        updateVideo // controller to handle update
    );

// Route to toggle publish status of a video
router
    .route("/:videoId/toggle/publish")
    .patch(togglePublishVideo); // PATCH /api/v1/videos/toggle/publish/:videoId

// Export the router as default export
export default router;
