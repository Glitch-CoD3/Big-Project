import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js"


//get all videos method written by chatgpt
const getAllvideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = await req.query
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        filter.owner = userId;
    }

    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // Using lean() for faster queries, returns plain JS objects
    const videosPromise = Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("owner", "username email")
        .lean();

    // Use estimatedDocumentCount for faster approximate total
    const totalPromise = Video.estimatedDocumentCount();

    const [videos, totalVideos] = await Promise.all([videosPromise, totalPromise]);

    return res.status(200).json(new ApiResponse(200, {
        videos,
        total: totalVideos,
        page: parseInt(page),
        totalPages: Math.ceil(totalVideos / parseInt(limit))
    }, "Videos fetched successfully"));

});

//upload video method
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and Description are required");
    }

    // Get uploaded video file
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    // Get uploaded thumbnail file
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Upload video to Cloudinary
    const uploadedVideo = await uploadToCloudinary(videoLocalPath);
    if (!uploadedVideo) {
        throw new ApiError(500, "Failed to upload video");
    }

    // Upload thumbnail to Cloudinary
    const uploadedThumbnail = await uploadToCloudinary(thumbnailLocalPath);
    if (!uploadedThumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    // Save to database
    const video = await Video.create({

        title,
        description,
        videoFile: uploadedVideo.secure_url,
        thumbnail: uploadedThumbnail.secure_url,
        duration: uploadedVideo.duration,
        owner: req.user._id,

    });

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));
});



const getVideoById = asyncHandler(async (req, res) => {
    //link theke video Id nibo
    const { videoId } = req.params;

    //Check if videoId exists in params.
    if (!videoId) {
        throw new ApiError(400, "Video ID not found in request params");
    }

    //Use Video.findById(videoId) to fetch the video.
    const video = await Video.findById(videoId).populate("owner", "name email");

    //Throw 404 if not found.
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //Return the video in a consistent ApiResponse.
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, tags } = req.body;

    //update thambnail, title, description, tags

    if(!videoId){
        throw new ApiError(400, "Video ID not found in request params");
    }
    const video = Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    //if thumbnail is there in request, upload to cloudinary
    if(req.file){
        const thumbnailLocalPath = req.file.path;

        if(!thumbnailLocalPath){
            throw new ApiError(400, "Thumbnail file is required");
        }

        const uploadedThumbnail = await uploadToCloudinary(thumbnailLocalPath);
        if(!uploadedThumbnail.url){
            throw new ApiError(500, "Failed to upload thumbnail");
        }

        const updateVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    tags,
                    thumbnail: uploadedThumbnail.secure_url
                }
            },
            {
                new:true,
            }
        ).select("-videoFile -duration -viewCount -owner -isPublished");

    }

    return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    //delete video by id
    if(!videoId){
        throw new ApiError(400, "Video ID not found in request params");
    }
    const video = await Video.findById(videoId);
    if (!video){
        throw new ApiError(404, "Video not found!")
    }

    await Video.findByIdAndDelete(videoId);

    return res
    .status(200)
    .json(new ApiResponse(200, null , "Video deleted Successfully"));
});


const togglePublishVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished; // toggle
    await video.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Publish status toggled")
    );
});



export {
    getAllvideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishVideo
}
