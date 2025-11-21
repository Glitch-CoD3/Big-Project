import mongoose, { Schema } from 'mongoose';

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: "",
        required:true,
    },

    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",

        }
    ],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }


}, { timestamps: true })


export const Playlist = mongoose.model("Playlist", playlistSchema)