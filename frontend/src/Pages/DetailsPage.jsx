import React, { useEffect, useState } from 'react';
import { Home, PlaySquare, Clock, ThumbsUp, CheckCircle, Share2, MoreHorizontal, User, History, PlayCircle, Flame } from 'lucide-react';
import AxiosInstance from '../api/AxiosInstance';
import { handleError } from '../utils/ApiError';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const Dashboard = () => {

const navigate = useNavigate();

const handleHome = (e) => {
    setTimeout(() => {
      navigate("/home");
    }, 1000);
  }

   const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inside DetailsPage.jsx
useEffect(() => {
    const fetchChannel = async () => {
        try {
            // 1. Get user info from localStorage (stored during login)
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            
            const userData = JSON.parse(userStr);
            const username = userData.user?.username || userData.username;

            // 2. Fetch using the /c/:username route
            const response = await AxiosInstance.get(`/users/c/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            setUserData (response.data.data);
            console.log(userData)
            
          
        } catch (err) {
            // If this fails with a 500, your backend Video router is still 
            // intercepting the request because of the route order.
            console.error("Fetch Error:", err);
        }
    };
    fetchChannel();
}, []);


    return (

      <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
        {/* --- SIDEBAR --- */}
        {/* We keep the sidebar fixed to the left since there is no navbar to toggle it */}
        <aside className="w-64 p-3 hidden md:flex flex-col gap-1 overflow-y-auto border-r border-zinc-800/50">
          <SidebarItem icon={<Home size={22} onClick={handleHome} />} label="Home" active />
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
                />
              </div>
            </div>

            {/* Channel Text Info */}
            <div className="flex flex-col justify-center flex-1">
              <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{userData?.fullName}</h1>

              <div className="flex flex-wrap items-center gap-2 text-[15px] text-zinc-400 mb-3">
                <span className="font-medium">@{userData?.username}</span>
                <span>•</span>
                <span>1.2M subscribers</span>
                <span>•</span>
                <span>450 videos</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 text-[15px] mb-5 cursor-pointer hover:text-white transition-colors">
                <p className="line-clamp-1">Mastering Web Development one byte at a time. Join us for React, Node, and Tailwind tutorials...</p>
                <ChevronRight size={18} />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-zinc-200 transition-colors">
                  Subscribe
                </button>
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
              {['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Community', 'Search'].map((tab, i) => (
                <button
                  key={tab}
                  className={`py-3.5 text-[15px] font-bold whitespace-nowrap border-b-2 transition-all ${i === 0 ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 4. CONTENT GRID */}
          <div className="max-w-[1284px] mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">For You</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                <VideoCard key={item} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  };

  // --- Helper Components ---

  const SidebarItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center gap-5 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-zinc-800 font-bold' : 'hover:bg-zinc-900'}`}>
      {icon}
      <span className="text-[14px]">{label}</span>
    </div>
  );

  const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
  );


  const VideoCard = () => (
    <div className="flex flex-col gap-3 cursor-pointer group">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
        <img
          src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500"
          alt="Thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-black/90 text-[11px] px-1.5 py-0.5 rounded font-bold tracking-tight">
          10:42
        </span>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col pr-6">
          <h4 className="text-[15px] font-bold line-clamp-2 leading-[1.2rem] mb-1">
            Building a Realtime Chat App with React & Firebase
          </h4>
          <div className="text-[13px] text-zinc-400 leading-tight">
            <p className="hover:text-white transition-colors">Daily Code</p>
            <p>82K views • 1 year ago</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );

  export default Dashboard;