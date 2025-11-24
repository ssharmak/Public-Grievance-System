import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

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

// Mock data for simulation
export const MOCK_USER_OFFICIAL = {
  id: 'off1',
  name: 'Official User',
  role: 'official',
  managedCategories: ['water', 'electricity'],
  email: 'official@example.com'
};

export const MOCK_USER_SUPER_ADMIN = {
  id: 'admin1',
  name: 'Super Admin',
  role: 'super_admin',
  managedCategories: [], // Super admin sees all or manages system
  email: 'admin@example.com'
};

// Simulate loading user context (mock)
export const loadMockUser = (type = 'official') => {
  const user = type === 'super_admin' ? MOCK_USER_SUPER_ADMIN : MOCK_USER_OFFICIAL;
  localStorage.setItem('user', JSON.stringify(user));
  // In a real app, we might set a mock token too
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'mock-token-123');
  }
  return user;
};

export default api;
