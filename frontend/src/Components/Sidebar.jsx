import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils/ApiError";

export const Sidebar = ({ mode, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [LogedInuser, setLogedInuser] = useState("");

  useEffect(() => {
    setLogedInuser(localStorage.getItem("name") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    handleSuccess("Logged out successfully");
    navigate("/login");
  };


  const handleHome = (e) => {
    setTimeout(() => {
      navigate("/home");
    }, 100);
  }

  const isMini = mode === "mini";

  return (
    <aside
      className={`
    ${isMini ? "hidden md:flex w-20 fixed top-0 z-30" : "fixed w-60 top-0 z-50"}
    h-screen  /* Full screen height */
    bg-gray-900 border-r
    flex flex-col
    transition-transform duration-300
    ${!isMini && (isOpen ? "translate-x-0" : "-translate-x-full")}
  `}
    >
      {/* Header: Logo + Menu Toggle */}
      {!isMini && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700">
          {/* Menu Icon on the left */}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Logo on the right */}
          <div className="text-xl font-bold text-white">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
          </div>
        </div>
      )}

      {/* Sidebar Items */}
      <div className="flex-1 flex flex-col py-4 px-2 space-y-2 overflow-y-auto">
        <SidebarItem icon="🏠" label="Home" showLabel={!isMini}  onClick={handleHome}/>
        <SidebarItem icon="▶️" label="Shorts" showLabel={!isMini} />
        <SidebarItem icon="📺" label="Subscriptions" showLabel={!isMini} />

        <hr className="border-gray-700 my-2" />

        <SidebarItem icon="👤" label={LogedInuser} showLabel={!isMini} />
        <SidebarItem icon="🕒" label="History" showLabel={!isMini} />
        <SidebarItem icon="👍" label="Liked videos" showLabel={!isMini} />

        <hr className="border-gray-700 my-2" />

        <SidebarItem
          icon="😢"
          label="Logout"
          showLabel={!isMini}
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, showLabel, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
  >
    <div className="flex justify-center w-6 text-2xl">{icon}</div>
    {showLabel && <span className="text-sm whitespace-nowrap">{label}</span>}
  </div>
);
