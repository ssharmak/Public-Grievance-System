import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
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

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Disabled to prevent loop, let UI handle it
    }
    return Promise.reject(error);
  }
);

// Mock data for simulation - REMOVED for real integration
export const MOCK_USER_OFFICIAL = null;
export const MOCK_USER_SUPER_ADMIN = null;

// Simulate loading user context (mock) - REMOVED
export const loadMockUser = (type = 'official') => {
  return null;
};

export default api;
