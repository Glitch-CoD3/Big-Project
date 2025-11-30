import React from "react";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  User
} from "lucide-react";
import logo from "/logo.png"

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b z-50">
      <div className="flex items-center justify-between px-4 h-14">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="p-2 rounded-full hover:bg-gray-100">
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
              className="w-full px-4 py-1.5 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button className="px-5 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 hover:bg-gray-200">
              <Search size={18} />
            </button>
          </div>

          <button className="ml-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Mic size={18} />
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button className="p-2 rounded-full hover:bg-gray-100 md:hidden">
            <Search size={22} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video size={22} />
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={22} />
          </button>

          <button className="ml-2 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={18} />
          </button>
        </div>

      </div>
    </header>
  );
};
