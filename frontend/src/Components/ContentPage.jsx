import FetchVideos from "../api/FetchVideo.jsx";

export const ContentPage = () => {
  return (
    <div className="bg-black min-h-screen px-4 pb-10">
      <div className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
      ">
        <FetchVideos />
      </div>
    </div>
  );
};
