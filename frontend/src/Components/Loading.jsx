import React from "react";

const LoadingDots = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90">
            {/* Spinner */}
            <div className="relative">
                <div className="animate-spin rounded-full border-4 border-gray-700 h-20 w-20"></div>
                <div className="absolute top-0 left-0 animate-spin rounded-full border-4 border-t-4 border-blue-500 border-t-transparent h-20 w-20"></div>
            </div>

            {/* Loading Text */}
            <p className="mt-4 text-gray-200 text-lg font-medium">{message}</p>
            
            {/* Optional: Loading dots animation */}
            <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
};

export default LoadingDots;