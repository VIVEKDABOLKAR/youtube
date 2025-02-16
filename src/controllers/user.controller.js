import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js'
import path from 'path'

const registerUser = asyncHandler(async (req, res) => { //althogh we use asyncHandler we forcefully use async 
    // get user details from frontend
    // validation - not empty
    // check if user already exits
    // check for image and avatar
    // upload it on cloudinary
    // create user object
    // remove password and refresh token from response
    // check for user creation
    // return res

    const {fullName, email, username, password} = req.body;



    if (
        [fullName, email, username, password].some((field) => field?.trim() === "" )
    ) {
        throw new ApiError(400, "fullname is empty", )

    }

    const exisstUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (exisstUser) {
        throw new ApiError(409, "user with email or usrname used")
    }


    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = undefined;
    if(!req.files?.coverImage == undefined){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if (!avatar) {
        throw new ApiError(400, "Avatar file isn't uploaded ")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "somthing went wring while createing user");   
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user created succesfully")
    )
})
 
export {
    registerUser,
}
