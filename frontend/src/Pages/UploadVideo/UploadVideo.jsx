import { useState } from "react";
import axios from "axios";
import { handleSuccess } from "../../utils/ApiError";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingDots from "../../Components/Loading";

function UploadVideo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
    thumbnail: null
  });

  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000/api/v1/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video file");
      return;
    }
    setVideoFile(file);
  };

  const handleThumbnailChange = (e) => {
    setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!newTag || tags.includes(newTag)) return;
      setTags(prev => [...prev, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) { alert("Title is required"); return; }
    if (!videoFile) { alert("Video file is required"); return; }

    setLoading(true); // start loading

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("visibility", formData.visibility);
      uploadData.append("thumbnail", formData.thumbnail);
      uploadData.append("videoFile", videoFile);
      uploadData.append("tags", JSON.stringify(tags));

      const token = localStorage.getItem("accessToken");
      const response = await axios.post(API_URL, uploadData, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const { success, message } = response.data;
      if(success){
        handleSuccess(message);
        setTimeout(() => navigate("/home"), 1000);
      }

    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Upload Video</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Video File */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Video File</label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoChange} 
            className="p-2 text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-600 bg-gray-800"
          />
          {videoFile && <p className="text-xs mt-1.5 text-gray-400 break-words">{videoFile.name}</p>}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Title</label>
          <input 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            className="p-2 text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-600 bg-gray-800 text-white"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
            className="p-2 text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-600 bg-gray-800 text-white"
          />
        </div>

        {/* Thumbnail */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Thumbnail</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleThumbnailChange} 
            className="p-2 text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-600 bg-gray-800"
          />
        </div>

        {/* Visibility */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Visibility</label>
          <select 
            name="visibility" 
            value={formData.visibility} 
            onChange={handleChange}
            className="p-2 text-sm rounded border border-gray-600 focus:outline-none focus:border-blue-600 bg-gray-800 text-white"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        {/* Tags */}
        <div className="flex flex-col">
          <label className="text-sm mb-1.5 text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2 items-center border border-gray-600 p-2 rounded bg-gray-800">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center">
                {tag}
                <button type="button" className="ml-1" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
            <input 
              value={tagInput} 
              onChange={(e) => setTagInput(e.target.value)} 
              onKeyDown={handleTagKeyDown} 
              placeholder="Press Enter to add tag"
              className="flex-1 p-1 bg-gray-800 text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Upload Button */}
        <button 
          type="submit" 
          disabled={loading}
          className={`mt-3 p-3 rounded text-white text-sm font-medium ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-800'}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading && <LoadingDots />} {/* optional loading indicator */}

      <ToastContainer />
    </div>
  );
}

export default UploadVideo;
