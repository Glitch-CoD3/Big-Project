import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {Video} from "../models/video.model.js"


//get all videos method written by chatgpt
const getAllvideos = asyncHandler(async (req, res) => {
    const {page=1, limit=10, query, sortBy , sortType, userId} = await req.query
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId) {
        filter.uploadedBy = userId;
    }

    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // Using lean() for faster queries, returns plain JS objects
    const videosPromise = Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("uploadedBy", "name email")
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
    
    if(!title || !description){
        throw new ApiError(400, "Title and Description are required");
    }

    const videoLocalPath = req.files?.video?.[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400, "Video file is required");
    }

    const uploadedVideo = await uploadToCloudinary(videoLocalPath);

    if(!uploadedVideo){
        throw new ApiError(500, "Failed to upload video");
    }

    //upload on db 
    const video = await Video.create({
        title,
        description,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        videoUrl: uploadedVideo?.url || "",
        // videoPublicId: uploadedVideo.public_id,
        uploadedBy: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"));
    //get video, upload to cloudinary and create video document in db
});

const getVideoById= asyncHandler(async(req, res) =>{
    //link theke video Id nibo
    const { videoId }= req.params;

    //Check if videoId exists in params.
    if(!videoId){
        throw new ApiError(400, "Video ID not found in request params");
    }

    //Use Video.findById(videoId) to fetch the video.
    const video= await Video.findById(videoId).populate("uploadedBy", "name email");

    //Throw 404 if not found.
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    //Return the video in a consistent ApiResponse.
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});


const updateVideo = asyncHandler(async(req, res) =>{
    const { videoId }= req.params;
    const { title, description, tags } = req.body;

    //update thambnail, title, description, tags
});


const deleteVideo = asyncHandler(async(req, res) =>{
    const { videoId }= req.params;

    //delete video by id
});


const togglePublishVideo = asyncHandler(async(req, res) =>{
    const { videoId }= req.params;
});


export {
    getAllvideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishVideo
}
