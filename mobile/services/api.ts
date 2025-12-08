/**
 * @file api.ts
 * @description Centralized Axios instance configuration for the Mobile App.
 * Handles base URL setup, authentication headers, and response logging.
 */

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL (Update this based on environment: Local or AWS)
export const API_BASE = "http://13.201.75.180:5000/api";

/**
 * Axios instance with default configuration.
 * Timeout set to 60s for slow networks.
 */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attaches the Bearer token from AsyncStorage to every request.
 */
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

/**
 * Response Interceptor
 * Logs API errors for easier debugging during development.
 */
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
