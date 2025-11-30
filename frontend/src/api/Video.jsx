import { useState, useEffect } from "react";
import AxiosInstance from "./AxiosInstance.jsx"; // remove extra dot at the end


function FetchVideos() {
  const [videos, setVideos] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const URI_ = "http://localhost:8000/api/v1/videos"; // your actual endpoint

  useEffect(() => {
    // async function must be defined inside useEffect
    const fetchVideos = async () => {
      try {
        const response = await AxiosInstance.get(URI_);
        console.log(response)

      } catch (err) {
        console.error("Video Fetch Problem:", err);
        setError("Video Fetch Problem"); 
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); // call async function
  }, []);

}

export default FetchVideos;
