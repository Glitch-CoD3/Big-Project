import React from "react";

const VideoCard = ({ video }) => {
    return (
        <div className="cursor-pointer">

            {/* Thumbnail */}
            <div className="relative rounded-lg overflow-hidden bg-gray-300 aspect-video">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                <div className="absolute bottom-1 right-1 bg-black text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                </div>
            </div>

            {/* Video Details */}
            <div className="flex gap-3 mt-3">

                {/* Channel Avatar */}
                <img
                    src={video.avatar}
                    alt={video.channel}
                    className="w-9 h-9 rounded-full object-full flex-shrink-0 bg-gray-300"
                />
                

                {/* Meta */}
                <div>
                    <h3 className="text-sm font-medium leading-tight line-clamp-2">
                        {video.title}
                    </h3>

                    <p className="text-xs text-gray-600 mt-1">
                        {video.channel}
                    </p>

                    <p className="text-xs text-gray-600">
                        {video.views} · {video.time}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default VideoCard;
