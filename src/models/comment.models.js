import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commentSchema = new Schema({

        comment:{
            type: String,
            required:true
        },

        video:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            
        },

        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        parentComment:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },

        likeComment:{
            type: [mongoose.Schema.Types.ObjectId],
            ref:"User",
            default: [],
        },

},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema)