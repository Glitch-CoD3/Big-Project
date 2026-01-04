import { Router } from "express";
import {
  deleteVideo,
  getAllvideos,
  getVideoById,
  publishVideo,
  togglePublishVideo,
  updateVideo,
  addView,
  getVideosByUserId,          // Add this import
  getVideosByUsername,        // Add this import
  getTotalVideosByUserId,     // Add this import
  getSimpleVideoCountByUserId // Add this import
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* =========================
   PUBLIC ROUTES (NO AUTH)
   ========================= */

// Get all videos (homepage)
router.get("/", getAllvideos);

// Get videos by user ID (PUBLIC or PROTECTED - decide based on your needs)
router.get("/user/:userId", getVideosByUserId);          // Moved before :videoId

// Get videos by username
router.get("/channel/:username", getVideosByUsername);  // Moved before :videoId

// Get video statistics (PUBLIC)
router.get("/count/user/:userId", getTotalVideosByUserId);
router.get("/count/simple/user/:userId", getSimpleVideoCountByUserId);

// Watch a single video (PUBLIC) - THIS MUST COME AFTER SPECIFIC ROUTES
router.get("/:videoId", getVideoById);

/* =========================
   PROTECTED ROUTES (AUTH)
   ========================= */

router.use(verifyJWT);

// Publish video
router.post(
  "/",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);

// Delete video
router.delete("/:videoId", deleteVideo);

// Update video thumbnail
router.patch(
  "/:videoId",
  upload.single("thumbnail"),
  updateVideo
);

// Toggle publish
router.patch("/:videoId/toggle/publish", togglePublishVideo);
router.post('/:videoId/view', addView);

export default router;