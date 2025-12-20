import { Router } from "express";
import {
  deleteVideo,
  getAllvideos,
  getVideoById,
  publishVideo,
  togglePublishVideo,
  updateVideo,
  addView
} from "../controllers/video.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/* =========================
   PUBLIC ROUTES (NO AUTH)
   ========================= */

// Get all videos (homepage)
router.get("/", getAllvideos);

// Watch a single video (PUBLIC)
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
