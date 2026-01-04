import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const uploadDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - uploadDate;

    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      return diffHours <= 0
        ? "Just now"
        : `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  return (
    <div
      className="w-full cursor-pointer bg-black rounded-xl  group hover:bg-[#291b11] transition-all duration-200"
      onClick={() => navigate(`/watch/${video._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative rounded-lg overflow-hidden bg-gray-300 aspect-video group-hover:scale-[1.01] transition-transform duration-200">
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
            ? Math.floor(video.duration / 60) +
              ":" +
              ("0" + Math.floor(video.duration % 60)).slice(-2)
            : "0:00"}
        </div>
      </div>

      {/* Video Info */}
      <div className="flex mt-3 gap-3">
        <img
          src={video.owner?.avatar || "/logo.png"}
          alt={video.owner?.username || "Channel"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/logo.png";
          }}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="text-[17px] font-bold leading-snug line-clamp-2 text-white group-hover:text-gray-100 transition-colors">
            {video.title}
          </h3>

          <p className="text-md font-medium text-gray-400 mt-1 flex flex-wrap gap-2 group-hover:text-gray-300 transition-colors">
            <span>{video.owner?.fullName || "Channel"}</span>
          </p>

          <p className="text-md text-gray-400 flex flex-wrap gap-2 group-hover:text-gray-300 transition-colors">
            <span>{video.viewCount} views</span>
            <span> · {getTimeAgo(video.createdAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;