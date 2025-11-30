import React from "react";

export const Sidebar = () => {
  return (
    <aside className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-white border-r hidden md:block">
      
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
          <SidebarItem label="Your channel" icon="👤" />
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
        </nav>

      </div>
    </aside>
  );
};

/* ---------------------------------- */
/* Sidebar Item Component              */
/* ---------------------------------- */

const SidebarItem = ({ icon, label, active }) => {
  return (
    <div
      className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer
        ${active ? "bg-gray-200 font-medium" : "hover:bg-gray-100"}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
};
