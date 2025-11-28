import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.models.js"
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";



// Controller
const getAllPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({ visibility: "public" })
        .populate({
            path: "videos.video",
            match: { _id: { $type: "objectId" } } // only populate valid ObjectIds
        })
        .sort({ createdAt: -1 });


    res.status(200).json({
        success: true,
        data: playlists,
        message: "Public playlists fetched successfully"
    });
});


const createdPlaylist = asyncHandler(async (req, res) => {
    const { title, description } = req.body || {};
    const { videoId } = req.params;   // optional
    const userId = req.user?._id;

    if (!title) {
        throw new ApiError(400, "Playlist title is required");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized user");
    }

    // Check for duplicate playlist for the same user
    const existingPlaylist = await Playlist.findOne({
        name: title,
        createdBy: userId
    });

    if (existingPlaylist) {
        throw new ApiError(400, "You already have a playlist with this title");
    }

    const playlistData = {
        name: title,
        description,
        createdBy: userId,
        videos: []
    };

    // Add video only if provided
    if (videoId) {
        playlistData.videos.push({
            video: videoId,
            position: 0
        });
    }

    const playlist = await Playlist.create(playlistData);

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user?._id;

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }

    // Check if playlist exists and belongs to the user
    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you do not have permission to delete it");
    }

    await Playlist.deleteOne({ _id: playlistId });

    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    );
});




const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params; // get videoId from params
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);
    if (!video) { // fixed typo "vide"
        throw new ApiError(404, "Video not found");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.createdBy.toString() !== userId.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    // Check if video already exists in playlist
    const exists = playlist.videos.some(v => v.video.toString() === videoId);
    if (exists) {
        throw new ApiError(400, "Video already in playlist");
    }

    // Add video to playlist
    playlist.videos.push({
        video: videoId,
        position: playlist.videos.length
    });

    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    );
});



const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const user = req.user._id;

    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if the user is the owner
    if (playlist.createdBy.toString() !== user.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    // Remove the video
    playlist.videos = playlist.videos.filter(
        (v) => v.video.toString() !== videoId
    );

    await playlist.save();

    res.status(200).json(new ApiResponse(true, null, "Video removed successfully"));
});




export {
    createdPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getAllPlaylists,
    deletePlaylist
}