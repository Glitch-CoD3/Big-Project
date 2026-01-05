import React, { useEffect, useState, useCallback, memo } from 'react';
import { Home, PlaySquare, Clock, ThumbsUp, CheckCircle, Share2, MoreHorizontal, User, History, PlayCircle, Flame } from 'lucide-react';
import AxiosInstance from '../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import LoadingDots from '../Components/Loading';
import VideoCard from '../Components/VideoCard'; // Import your actual VideoCard
import SubscribeButton from '../Components/SubscribeButton';

// Memoized components
const SidebarItem = memo(({ icon, label, active = false, onClick }) => (
  <div
    className={`flex items-center gap-5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-zinc-800 font-bold' : 'hover:bg-zinc-900'}`}
    onClick={onClick}
  >
    {icon}
    <span className="text-[14px]">{label}</span>
  </div>
));

SidebarItem.displayName = 'SidebarItem';

const ChevronRight = memo(({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
));

ChevronRight.displayName = 'ChevronRight';

// Tabs data
const CHANNEL_TABS = ['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Community', 'Search'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]); // Add videos state
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false); // Separate loading for videos
  const [totalVideos, setTotalVideos] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriber, setSubscriber] = useState(0);
  const [subscribeTo, setSubscribeTo] = useState(0);



  const handleHome = useCallback(() => {
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  }, [navigate]);

  


  // Fetch channel info
 const fetchChannel = useCallback(async () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("accessToken");

  if (!username || !token) {
    setLoading(false);
    return;
  }

  try {
    const response = await AxiosInstance.get(`/users/c/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const channelData = response.data.data;

    setUserData(channelData);
    setIsSubscribed(channelData?.isSubscribed ?? false);
    setSubscriber(channelData?.subscribersCount ?? 0);
    setSubscribeTo(channelData?.channelsSubscribeToCount ?? 0);
  } catch (error) {
    console.error("Failed to fetch channel", error);
  } finally {
    setLoading(false);
  }
}, []);



  // Fetch user's videos

  const fetchUserVideos = useCallback(async () => {
    if (!userData?._id) return;

    setVideosLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if(!token){
        return;
      }
      // Fetch videos by user ID or username
      const response = await AxiosInstance.get(`user/${userData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setVideos(response.data.data.videos);
      setTotalVideos(response.data.data.total);
      // console.log("User Videos:", response.data.data);
    } catch (err) {
      console.error("Failed to fetch user videos:", err);
    } finally {
      setVideosLoading(false);
    }
  }, [userData?._id]);

  useEffect(() => {
    fetchChannel();
  }, [fetchChannel]);

  // Fetch videos when userData is available
  useEffect(() => {
    if (userData) {
      fetchUserVideos();
    }
  }, [userData, fetchUserVideos]);

  if (loading) {
    return <LoadingDots message="Loading Details" />
  }



  // channel subscribe toggle button
   const handleSubscribeToggle = async () => {
    try {
      if (isSubscribed) {
        await AxiosInstance.post('/subscriptions/unsubscribe', {
          channelId: userData?._id,
        });
      } else {
        await AxiosInstance.post('/subscriptions/subscribe', {
          channelId: userData?._id,
        });
      }

      setIsSubscribed((prev) => !prev);
    } catch (error) {
      console.error('Subscription failed', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 p-3 hidden md:flex flex-col gap-1 overflow-y-auto border-r border-zinc-800/50">
        <SidebarItem icon={<Home size={22} />} label="Home" active onClick={handleHome} />
        <SidebarItem icon={<PlaySquare size={22} />} label="Shorts" />
        <SidebarItem icon={<PlayCircle size={22} />} label="Subscriptions" />
        <hr className="my-3 border-zinc-800" />
        <h3 className="px-3 py-2 text-md font-bold flex items-center gap-2">You <ChevronRight size={16} /></h3>
        <SidebarItem icon={<User size={22} />} label="Your channel" />
        <SidebarItem icon={<History size={22} />} label="History" />
        <SidebarItem icon={<PlaySquare size={22} />} label="Your videos" />
        <SidebarItem icon={<Clock size={22} />} label="Watch later" />
        <SidebarItem icon={<ThumbsUp size={22} />} label="Liked videos" />
        <hr className="my-3 border-zinc-800" />
        <h3 className="px-3 py-2 text-md font-bold">Explore</h3>
        <SidebarItem icon={<Flame size={22} />} label="Trending" />
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto">
        {/* 1. CHANNEL COVER IMAGE */}
        <div className="w-full aspect-[6/1] min-h-[150px] bg-zinc-800">
          <img
            src={userData?.coverImage || "/logo2.png"}
            alt="Channel Banner"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* 2. CHANNEL HEADER SECTION */}
        <div className="max-w-[1284px] mx-auto px-6 py-6 flex flex-col md:flex-row gap-6">
          {/* Profile Image */}
          <div className="shrink-0">
            <div className="w-40 h-40 rounded-full overflow-hidden border-none">
              <img
                src={userData?.avatar || "/logo.png"}
                alt="Channel Avatar"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Channel Text Info */}
          <div className="flex flex-col justify-center flex-1">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{userData?.fullName}</h1>

            <div className="flex flex-wrap items-center gap-2 text-[15px] text-zinc-400 mb-3">
              <span className="font-medium">@{userData?.username}</span>
              <span>•</span>
              <span>{subscriber} subscribers</span>
              <span>•</span>
              <span>{totalVideos} videos</span> {/* Dynamic video count */}
              <span>•</span>
              <span>{subscribeTo} Subscribe </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-400 text-[15px] mb-5 cursor-pointer hover:text-white transition-colors">
              <p className="line-clamp-1">Mastering Web Development one byte at a time. Join us for React, Node, and Tailwind tutorials...</p><button>more</button>
              <ChevronRight size={18} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <SubscribeButton
                isSubscribed={isSubscribed}
                onSubscribe={handleSubscribeToggle}
              />
              <button className="bg-zinc-800/80 px-5 py-2 rounded-full font-bold text-sm hover:bg-zinc-700 transition-colors">
                Join
              </button>
              <button className="bg-zinc-800/80 p-2.5 rounded-full hover:bg-zinc-700 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. CHANNEL TABS */}
        <div className="max-w-[1284px] mx-auto px-6 border-b border-zinc-800 sticky top-0 bg-[#0f0f0f] z-20">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {CHANNEL_TABS.map((tab, i) => (
              <button
                key={tab}
                className={`py-3.5 text-[15px] font-bold whitespace-nowrap border-b-2 transition-all ${i === 0 ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONTENT GRID - Show user's actual videos */}
        <div className="max-w-[1284px] mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Videos</h3>
          </div>

          {videosLoading ? (
            <div className="flex justify-center py-12">
              <LoadingDots message="Loading videos..." />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No videos uploaded yet</p>
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} /> // Use your actual VideoCard
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default memo(Dashboard);