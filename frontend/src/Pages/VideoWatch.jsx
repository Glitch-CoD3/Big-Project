import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AxiosInstance from "../api/AxiosInstance";
import { CheckCircle2, ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from "lucide-react";
import Header from "../Components/Header";
import SubscribeButton from '../Components/SubscribeButton';


const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState(" ")
  const [isSubscribed, setIsSubscribed] = useState(false);
  

  // Track if we have already sent the view request for this specific video
  const viewCounted = useRef(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await AxiosInstance.get(`/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideo(res.data.data);
      } catch (err) {
        console.error("Failed to load video", err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    // Reset the tracker when the videoId changes
    viewCounted.current = false;
    fetchVideo();
  }, [videoId]);

  // Function to call the unique view API
  const handlePlay = async () => {
    if (viewCounted.current) return; // Prevent spamming the API

    try {
      const token = localStorage.getItem("accessToken");
      const response = await AxiosInstance.post(`/${videoId}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.message === "Unique view added successfully") {
        // Update UI instantly (Optimistic Update)
        setVideo((prev) => ({ ...prev, viewCount: prev.viewCount + 1 }));
      }

      viewCounted.current = true; // Mark as done for this session
    } catch (err) {
      // Fail silently to not disturb the viewer
      console.error("View could not be counted:", err.response?.data?.message || err.message);
    }
  };

  const formatViews = (count) => {
    if (!count) return "0";

    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };




  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (!video) return <p className="text-white p-10">Video not found</p>;

  return (
    <div className="pt-2  bg-black min-h-screen text-white flex flex-col gap-6">
      {/* Video Player Section */}
      <div className="relative w-full max-h-[73vh]  overflow-hidden bg-black shadow-lg flex justify-center items-center">
        {video.videoFile ? (
          <video
            src={video.videoFile}
            controls
            autoPlay
            onPlay={handlePlay} // <-- Triggered when user clicks play
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


      

      {/* Video Details Section */}
      <div className="bg-[#0f0f0f] text-white p-4 font-sans rounded-lg">
        <h1 className="text-xl font-bold mb-1">{video.title}</h1>
        <p className="text-sm text-gray-400 mb-4">{formatViews(video.viewCount)} views</p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900 overflow-hidden border border-gray-700">
              <img src={video.owner?.avatar} alt="Channel" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{video.owner?.fullName}</span>
                <CheckCircle2 size={14} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-400">Subscribers</span>

            </div>
            
              <SubscribeButton
                isSubscribed={isSubscribed}
              />
            
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-gray-600">
                <ThumbsUp size={18} />
                <span className="text-sm">{video.likes || 0}</span>
              </button>
              <button className="px-4 py-2 hover:bg-[#3f3f3f]">
                <ThumbsDown size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f]">
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* //description box */}
        <div className="mt-4 p-3 bg-white/10 hover:bg-white/[0.15] rounded-xl cursor-pointer transition-colors group">
          <p className="text-sm font-semibold mb-1">Description</p>
          <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">
            {video.description || "In this video, we dive deep into the latest trends and features. Don't forget to like and subscribe for more content like this!"}
          </p>
          <button className="text-sm font-bold mt-2 text-white/70 group-hover:text-white">Show more</button>
        </div>
      </div>
      
    </div>
    
  );
};

export default Watch;