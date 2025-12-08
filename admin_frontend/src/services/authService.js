/**
 * @file authService.js
 * @description Authentication services for the Admin Frontend.
 * Handles login and logout operations, including token management in localStorage.
 */

import api from './api';

/**
 * Log in a user (Admin/Official).
 * Sends credentials to backend, and if successful, stores the JWT token and user info.
 * @param {string} emailOrPhone - User's email or phone number
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response containing token and user data.
 */
export const login = async (emailOrPhone, password) => {
  const response = await api.post('/auth/login', { emailOrPhone, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * Log out the current user.
 * Clears local storage tokens and redirects to the login page.
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
