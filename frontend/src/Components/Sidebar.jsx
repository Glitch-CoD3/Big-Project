import { Home } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils/ApiError";

export const Sidebar = () => {

  const navigate = useNavigate();
  const [LogedInuser, setLogedInuser] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setLogedInuser(`${name}`);
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    handleSuccess("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-gray-900 border-r hidden md:block">

      <div className="h-full overflow-y-auto px-2 py-3 space-y-6">

        {/* PRIMARY */}
        <nav className="space-y-1">
          <SidebarItem label="Home" icon="🏠" active />
          <SidebarItem label="Shorts" icon="▶️" />
          <SidebarItem label="Subscriptions" icon="📺" />
        </nav>

        <hr />

        {/* YOU */}
        <nav className="space-y-1">
          <SidebarItem label={LogedInuser} icon="👤" active />
          <SidebarItem label="History" icon="🕒" />
          <SidebarItem label="Playlists" icon="📂" />
          <SidebarItem label="Your videos" icon="🎥" />
          <SidebarItem label="Watch later" icon="⏱️" />
          <SidebarItem label="Liked videos" icon="👍" />
        </nav>

        <hr />

        {/* EXPLORE */}
        <nav className="space-y-1">
          <SidebarItem label="Trending" icon="🔥" />
          <SidebarItem label="Music" icon="🎵" />
          <SidebarItem label="Gaming" icon="🎮" />
          <SidebarItem label="News" icon="📰" />
          <SidebarItem label="Sports" icon="🏆" />
          <SidebarItem label="logOut" icon="😢" onClick={handleLogout} />
        </nav>

      </div>
    </aside>

  );
};

/* ---------------------------------- */
/* Sidebar Item Component              */
/* ---------------------------------- */

const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer
        ${active ? "bg-gray-700 font-medium" : "hover:bg-gray-700"}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
      
    </div>
    
  );
};
