import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/videos",
  timeout: 10000,
});

export default AxiosInstance;