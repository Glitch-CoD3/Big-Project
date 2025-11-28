import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose"; //for toggle-like function

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!videoId) {
        throw new ApiError(404, "No videoId Found");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalComments = await Comment.countDocuments({ video: videoId });

    return res.status(200).json(
        new ApiResponse(200, {
            comments,
            totalComments,
            currentPage: page,
            totalPages: Math.ceil(totalComments / limit)
        }, "Comments fetched successfully")
    );
});



const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    // ✅ Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // ✅ Create comment
    const VideoComment = await Comment.create({
        comment,
        video: videoId,
        owner: userId,
        parentComment: null
    });

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
});



const replyToComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment) {
        throw new ApiError(400, "Reply content is required");
    }

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
        throw new ApiError(404, "Parent comment not found");
    }

    const reply = await Comment.create({
        comment: comment,
        video: parentComment.video,
        owner: userId,
        parentComment: parentComment._id
    });

    return res.status(201).json(
        new ApiResponse(201, reply, "Reply added successfully")
    );
});



const toggleLikeComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id.toString();

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Convert every ID to string for correct comparison
    const likesArray = comment.likeComment.map(id => id.toString());

    const alreadyLiked = likesArray.includes(userId);

    if (alreadyLiked) {
        // Unlike
        await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likeComment: userId } }
        );
    } else {
        // Like
        await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likeComment: userId } }
        );
    }

    // Get updated count using aggregation
    const [aggregateResult] = await Comment.aggregate([
        { $match: { _id: comment._id } },
        {
            $project: {
                likeCount: { $size: { $ifNull: ["$likeComment", []] } }
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        liked: !alreadyLiked,
        likeCount: aggregateResult.likeCount,
        message: alreadyLiked ? "Comment unliked" : "Comment liked"
    });
});




const editComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body || {};

    const userId = req.user._id;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    if (!comment || comment.trim() === "") {
        throw new ApiError(400, "Comment is required");
    }

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
        throw new ApiError(404, "Comment not found");
    }

    if (existingComment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to edit this comment");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                comment: comment
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
});




const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // ✅ Only owner can delete
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    // ✅ Delete all replies
    await Comment.deleteMany({ parentComment: commentId });

    // ✅ Delete main comment
    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, null, "Comment and replies deleted successfully")
    );
});


export {
    getVideoComments,
    addComment,
    editComment,
    deleteComment,
    replyToComment,
    toggleLikeComment,
}