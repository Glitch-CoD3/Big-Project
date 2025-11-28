import mongoose, { Schema } from 'mongoose';

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: "",
    },

    videos: [
        {
            video: {
                type: Schema.Types.ObjectId,
                ref: "Video",
                required: true,
            },
            position: Number
        }
    ],

    visibility: {
        type: String,
        enum: ["public", "private", "unlisted"],
        default: "public",

    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
        index:true
    }


}, { timestamps: true })


export const Playlist = mongoose.model("Playlist", playlistSchema)