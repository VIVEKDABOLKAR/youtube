import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken';

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
   
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false}) 

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,error, );
        
    }
}

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
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path || undefined;
    
    

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
 
const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
    
    const { email, username, password} = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) { 
        throw new ApiError(400, "user not found")
    }

    const isPassWordValid = await user.isPasswordCorrect(password)

    if (!isPassWordValid) {
        throw new ApiError(401, "password is incorrect");
        
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser  = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: accessToken,
                refreshToken,
            },
            "user logged in successfully"
        )
    )

}) 

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "user log out successfully"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthrized access");   
    }

    const decodedToken = await jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken._id)

    if(!user) {
        throw new ApiError(402,"invaild token");   
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(402,"refresh token is expired");
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, newrefreshToken} = await generateAccessAndRefereshTokens(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
        new ApiResponse(200, {
            accessToken,
            newrefreshToken,
        },"Access token gentrated")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
