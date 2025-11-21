import { Router } from "express";
import {
    registerUser, loginUser, logOutUser,
    refreshAccessTokens, changeCurrentPassword,
    getCurrentUser, updateAccountDetails, updateUserAvatar,
    updateCoverImage, getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "coverImage", maxCount: 1
        },

        {
            name: "avatar", maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(
    [],
    loginUser)


//secured route for logout
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessTokens);

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-details").post(verifyJWT, updateAccountDetails)

//route update avatar and coverImage
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

//when data comes for params then it will be dynamic route
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

//watchHistory
router.route("/history").get(verifyJWT, getWatchHistory)

export default router;