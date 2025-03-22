import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Cho phép gửi Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
