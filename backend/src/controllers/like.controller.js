import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";




const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    // Check if the like already exists
    const existingLike = await Like.findOne({ user: userId, video: videoId });
    if (existingLike) {
        // If it exists, remove the like (unlike)
        await existingLike.remove();
        return res.status(200).json(new ApiResponse(200, "Video unliked successfully"));
    } else {
        // If it doesn't exist, create a new like
        const newLike = new Like({  user: userId, video: videoId });
        await newLike.save();
        return res.status(200).json(new ApiResponse(200, "Video liked successfully"));
    }
});




const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})


export { 
    toggleVideoLike,
    toggleTweetLike,
    getLikedVideos
}
