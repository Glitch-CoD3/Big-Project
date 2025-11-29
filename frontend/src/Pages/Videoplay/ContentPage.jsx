import React from "react";
import VideoCard from "./VideoCard";
import logo from "/logo.png"

const videos = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  thumbnail:logo,
  avatar:logo,
  title: "Build YouTube Clone with React & Tailwind",
  channel: "Dev Tutorials",
  views: "125K views",
  time: "2 days ago",
  duration: "12:45"
}));

export const PageContent = () => {
  return (
    <main className="pt-16 md:pl-60 bg-gray-50 min-h-screen">
      <div className="px-4 pb-10">

        <div className="
          grid gap-4
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-5
        ">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

      </div>
    </main>
  );
};
