import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from '../middlerwares/multer.middlerware.js'

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


export default router