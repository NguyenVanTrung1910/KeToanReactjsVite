import axios from "axios";

const API_URL = "https://localhost:44336/api";

const Api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Cho phép gửi Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
