/**
 * @file api.js
 * @description Configures the core Axios instance for the Admin Frontend.
 * Sets up base URL, request interceptors for auth tokens, and response interceptors for error handling.
 */

import axios from 'axios';

// Base URL determines the target API - uses Proxy (/api) in dev or env variable
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || '/api';

/**
 * Create Axios instance with default JSON headers.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Injects the Bearer Token from localStorage into the Authorization header of every request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global API errors.
 * Specifically watches for 401 Unauthorized to clear invalid sessions.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // We clear local storage to ensure the app knows the user is logged out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Note: Automatic redirect to /login is currently disabled to prevent infinite loops 
      // in case of persistent 401 errors on the dashboard.
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
