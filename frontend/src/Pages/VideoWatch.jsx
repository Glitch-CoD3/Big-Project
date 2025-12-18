import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AxiosInstance from "../api/AxiosInstance";
import { CheckCircle2, ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";

const token = localStorage.getItem("accessToken");
if (!token) {
  console.error("No token found");
}

const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await AxiosInstance.get(`/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideo(res.data.data);
        const videos= res.data.data;
        console.log("Fetched video data:", videos);
      }
      catch (err) {
        console.error("Failed to load video", err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!video) return <p className="text-white">Video not found</p>;
  if (error) return <p className="text-red-500 pt-16 px-6">{error}</p>;

  return (
    <div className="pt-16 px-6 bg-black min-h-screen text-white flex flex-col gap-6">
      {/* Video / Thumbnail */}
      <div className="relative w-full max-h-[75vh] rounded-lg overflow-hidden bg-black shadow-lg flex justify-center items-center">
        {video.videoFile ? (
          <video
            src={video.videoFile}
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img
            src={video.thumbnail || video.imageFile}
            alt={video.title}
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* Video Info & Actions */}
      <div className="bg-[#0f0f0f] text-white p-4 font-sans rounded-lg">
        {/* Video Title */}
        <h1 className="text-xl font-bold mb-3 line-clamp-2">
          {video.title}
        </h1>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Channel Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center overflow-hidden border border-gray-700">
              <img 
                src={video.owner?.avatar || "avatar"} 
                alt="Channel Logo" 
              />
            </div>
            <div className="flex flex-col mr-2">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-base">{video.owner?.username}</span>
                <CheckCircle2 size={14} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">{video.subscribers || "277K"} subscribers</span>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors ml-2">
              Subscribe
            </button>
          </div>

          {/* Right: Interaction Buttons */}
          <div className="flex items-center gap-2">
            {/* Like/Dislike */}
            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-gray-600 transition-colors">
                <ThumbsUp size={18} />
                <span className="text-sm font-medium">{video.likes || "0"}</span>
              </button>
              <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors">
                <ThumbsDown size={18} />
              </button>
            </div>

            {/* Share */}
            <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] transition-colors">
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>

            {/* Ask */}
            <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] transition-colors">
              <span className="text-sm font-medium">Ask</span>
            </button>

            {/* More Options */}
            <button className="p-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
