import FetchVideos from "../api/FetchVideo.jsx";

export const ContentPage = () => {
  return (
    <main className="pt-16 md:pl-60 bg-gray-50 min-h-screen">
      <div className="px-4 pb-10">
        <div
          className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
          <FetchVideos />
        </div>
      </div>
    </main>
  );
};
