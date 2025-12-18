import React, { use } from "react";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  User
} from "lucide-react";
import logo from "/image.png"
import { useNavigate } from "react-router-dom";






export const Header = () => {
  const navigate = useNavigate();
  const uploadVideo = () => {
    setTimeout(() => {
      navigate("/upload");
    }, 1000);
  };
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 border-b z-50">
      <div className="flex items-center justify-between px-4 h-14">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="p-2 rounded-full hover:bg-gray-700">
            <Menu size={22} />
          </button>

          <a href="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-6 w-auto" />
          </a>
        </div>

        {/* CENTER SECTION (Search Bar) */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="flex w-full max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-1.5 border bg-gray-700 border-gray-800 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button className="px-5 border border-l-0 border-gray-900 rounded-r-full bg-gray-700 hover:bg-gray-800">
              <Search size={18} />
            </button>
          </div>

          <button className="ml-3 p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Mic size={18} />
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button className="p-2 rounded-full hover:bg-gray-100 md:hidden">
            <Search size={22} />
          </button>

          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Video size={22} onClick={uploadVideo} />
          </button>

          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Bell size={22} />
          </button>

          <button className="ml-2 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <User size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};
