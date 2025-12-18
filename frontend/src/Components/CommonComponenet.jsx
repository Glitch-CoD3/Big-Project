import React from 'react';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const VideoHeader = () => {
  return (
    <div className="bg-[#0f0f0f] text-white p-4 font-sans">
      {/* Video Title */}
      <h1 className="text-xl font-bold mb-3 line-clamp-2">
        TELEFILM LAL | PAKISTAN 2019 - A FOUR DIMENSIONAL EXPERIENCE
      </h1>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Side: Channel Info & Subscribe */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center overflow-hidden border border-gray-700">
            {/* Placeholder for Channel Logo */}
            <img 
              src="https://api.dicebear.com/7.x/initials/svg?seed=PN" 
              alt="Channel Logo" 
            />
          </div>
          
          <div className="flex flex-col mr-2">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-base">Pakistan Navy</span>
              <CheckCircle2 size={14} className="text-gray-400" />
            </div>
            <span className="text-xs text-gray-400">277K subscribers</span>
          </div>

          <button className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors ml-2">
            Subscribe
          </button>
        </div>

        {/* Right Side: Interaction Buttons */}
        <div className="flex items-center gap-2">
          {/* Like/Dislike Group */}
          <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-gray-600 transition-colors">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">131K</span>
            </button>
            <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors">
              <ThumbsDown size={18} />
            </button>
          </div>

          {/* Share Button */}
          <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] transition-colors">
            <Share2 size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>

          {/* More/Ask Button (Generic version of the Ask button in image) */}
          <button className="flex items-center gap-2 bg-[#272727] px-4 py-2 rounded-full hover:bg-[#3f3f3f] transition-colors">
            <span className="text-sm font-medium">Ask</span>
          </button>

          {/* Options Button */}
          <button className="p-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f] transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoHeader;