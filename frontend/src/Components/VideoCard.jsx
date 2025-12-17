import React from "react";

const VideoCard = ({ video }) => {
  return (
    <div className="w-full cursor-pointer">
      {/* Thumbnail */}
      <div className="relative rounded-lg overflow-hidden bg-gray-300 aspect-video group">
        <img
          src={video.thumbnail || "/logo2.png"}
          alt={video.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/logo2.png";
          }}
          className="w-full h-full object-cover"
        />

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration
            ? Math.floor(video.duration / 60) + ":" + ("0" + Math.floor(video.duration % 60)).slice(-2)
            : "0:00"}
        </div>
      </div>

      {/* Video Info */}
      <div className="flex mt-3 gap-3">
        {/* Channel Avatar */}
        <img
          src={video.avatar || "/logo.png"}
          alt={video.owner?.email || "Channel"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/logo.png";
          }}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* Title & Meta */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-sm font-medium leading-snug line-clamp-2">
            {video.title}
          </h3>

          {/* Channel Name */}
          <p className="text-xs text-gray-600 mt-1">{video.owner?.username || "Channel"}</p>

          {/* Views and Upload Time */}
          <p className="text-xs text-gray-600">
            {video.viewCount} views · {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
