import React, { useMemo, useCallback } from "react";
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
} from "lucide-react";
import logo from "/image.png";
import { useNavigate } from "react-router-dom";

export const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();

  // Get avatar from localStorage only once
  const avatar = useMemo(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const outer = JSON.parse(userStr);
        const innerUser = outer.user || {};
        return innerUser.avatar || "";
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        return "";
      }
    }
    return "";
  }, []); // Empty array means it runs only once

  // Memoize all callbacks
  const uploadVideo = useCallback(() => {
    setTimeout(() => {
      navigate("/upload");
    }, 1000);
  }, [navigate]);

  const handleUser = useCallback(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white border-b z-50 ">
      <div className="flex items-center justify-between px-4 h-14">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <Menu size={22} />
          </button>
          <button onClick={goHome} className="flex items-center">
            <img src={logo} alt="Logo" className="h-6 w-auto" />
          </button>
        </div>

        {/* CENTER SECTION */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="flex w-full max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-1.5 bg-gray-700 border border-gray-800
                         rounded-l-full focus:outline-none focus:border-blue-500"
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
          <button className="p-2 rounded-full hover:bg-gray-700 md:hidden">
            <Search size={22} />
          </button>
          <button onClick={uploadVideo} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Video size={22} />
          </button>
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <Bell size={22} />
          </button>
          <button className="ml-2 rounded-full overflow-hidden w-8 h-8 sm:w-10 sm:h-10" onClick={handleUser}>
            <img
              src={avatar}
              alt="User Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                `;
              }}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

// Wrap with React.memo to prevent re-renders
export default React.memo(Header);