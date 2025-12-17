import { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance.jsx";
import VideoCard from "../Components/VideoCard.jsx";
import LoadingDots from "../Components/Loading.jsx";

function FetchVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await AxiosInstance.get("http://localhost:8000/api/v1/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched Videos:", response.data.data);

        // videos are inside data.videos according to your API
        setVideos(response.data.data.videos);
      } catch (err) {
        console.error("Video Fetch Problem:", err);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <LoadingDots />
  }
  if (error) return <p>{error}</p>;

  return (
    <>
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </>
  );
}

export default FetchVideos;
