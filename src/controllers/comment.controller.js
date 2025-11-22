import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";


const getVideoComments= asyncHandler( async(req, res) =>{
   const {videoId} = req.params;
   const {page=1, limit=10} = req.query;

   //get all comments for video
});


const addComment = asyncHandler( async (req, res) =>{
    const {videoId}= req.params;
} );


const updateComment = asyncHandler (async (req, res) =>{
    //update video comment
});

const deleteComment = asyncHandler (async (req, res) =>{
    //delete video comment
});


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}