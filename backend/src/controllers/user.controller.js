import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";


//method for generate access and refresh token
const generateRefreshAndAccessTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //store refresh token in db
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Token generation failed, try again !");
    }
}



const registerUser = asyncHandler(async (req, res) => {
    //get user data from frontend
    const { fullName, username, email, password } = req.body;
    //console.log("Full Name:",fullName);



    //validation (correct emial, user name, not empty password etc)
    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required");    //import ApiError
    // }    I can use this for every field or following below

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    //check if user already exists - username or email

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(400, "Already registered  !")
    }


    //check for image and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;   //access files from database models

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    //I also check for cover image if I want to make it required




    //upload them to cloudinary, check again avatar uploaded or not
    /*first import cloudinary function */
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Avatar is not uploaded, try again !")
    }



    //create user object- create entry in db
    const user = await User.create(
        {
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            username: username.toLowerCase(),
            email,
            password,

        }
    )

    //removed password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    //check for user creation success

    if (!createdUser) {
        throw new ApiError(500, "User registration failed, try again !")
    }


    //return response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})


//user login

const loginUser = asyncHandler(async (req, res) => {
    //req body ->data
    const { username, email, password } = req.body

    //check username or emial provided
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    //find the user by email or username
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    //if user not found
    if (!user) {
        throw new ApiError(404, "User not found, please register !");
    }

    //password check
    const isPasswordMatched = await user.isPasswordCorrect(password);

    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid credentials, password mismatch !");
    }

    //access and refresh token
    const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user._id);

    //again call database
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshTokens"
    )

    //send cookies
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    //response
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
        );

})


//Logout user
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }

        },

        {
            new: true,
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})


//add refreshAccessToken endpoint
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.body?.refreshToken || req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is invalid");
    }

    const accessToken = user.generateAccessToken();

    res.status(200).json({
        success: true,
        accessToken
    });
});




//change current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;  //take from user (frontend)
    if (confirmPassword !== newPassword && oldPassword !== newPassword) {
        throw new ApiError(401, "New password and confirm password should be matched! ");
    }

    const user = await User.findById(req.user?._id);  //we get user
    //now check the oldPassword
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "old password dosen't match! Try again!")
    }

    //now set new password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });  //save in database

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )





})


//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "Current user fetched successfully")
})


//update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, } = req.body
    if (!fullName || !email) {
        throw new ApiError(401, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email
            }
        },
        { new: true }  // update হওয়ার পরের information return korbe

    ).select("-password")  //password did't update here

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))

})


//update userAvatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on Avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            }
        },
        { new: true }

    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Updated successfully"));

})


//update cover image
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is missing")
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            }
        },
        { new: true }

    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Cover Image Updated successfully"));

})


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params    //user find from URL
    if (!username?.trim()) {
        throw new ApiError(400, "user name is missing");
    }

    //aggregation
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },

        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },

        {
            $addFields: {
                subcribersCount: {
                    $size: "$subscribers"  //use dollar sign bcz its a filed.
                },

                channelsSubscribeToCount: {
                    $size: "$subscribedTo"
                },

                isSubscribed: {

                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project: {
                fullName: 1,
                username: 1,
                subcribersCount: 1,
                channelsSubscribeToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(401, "Channel dosen't exist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "user channel fatched successfully")
        )
})


const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "Watch history fetched successfully"
            )
        )
})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateCoverImage,
    updateAccountDetails,
    getUserChannelProfile,
    getWatchHistory
};













//process all steps
//get user data from frontend
//validation (correct emial, user name, not empty password etc)
//check if user already exists - username or email
//check for image and avatar
//upload them to cloudinary, avatar
//create user object- create entry in db
//removed password and refresh token field from response
//check for user creation success
//return response