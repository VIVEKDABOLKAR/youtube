import { Router } from "express"
import { upload } from '../middlerwares/multer.middlerware.js'
import { registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlerwares/auth.middlerware.js"

const router = Router()

router.route("/register").post(
    //multer middleware
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    ) //./users/register: post

router.route("/login").post(upload.none(), loginUser)


//secure browse
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(upload.none(), refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

export default router