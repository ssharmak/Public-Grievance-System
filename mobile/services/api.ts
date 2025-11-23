import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE = "http://192.168.34.126:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach JWT token in every request (defensive)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("TOKEN READ ERROR", err);
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// Optional: log responses for debugging (remove in production)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(
      "API ERROR:",
      err?.response?.status,
      err?.response?.data || err.message
    );
    return Promise.reject(err);
  }
);

export default api;
