import { Router } from "express"
import { upload } from '../middlerwares/multer.middlerware.js'
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js"
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

export default router