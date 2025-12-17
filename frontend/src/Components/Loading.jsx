import React from "react";

const LoadingDots = ({ message = "Loading videos..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90">
            {/* Spinner */}
            <div className="animate-spin rounded-full border-8 border-t-8 border-blue-500 border-t-transparent h-20 w-20"></div>

            {/* Loading Text */}
            <p className="mt-4 text-gray-700 text-lg font-medium">{message}</p>
        </div>
    );
};

export default LoadingDots;
