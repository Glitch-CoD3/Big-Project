import { Router } from "express";
import { registerUser, loginUser, logOutUser, refreshAccessTokens } from "../controllers/user.controller.js";
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
router.route("/logout").post( verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessTokens);

export default router;