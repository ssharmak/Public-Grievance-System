/**
 * @file useAuth.js
 * @description Custom React Hook for accessing authentication state.
 * Provides user profile data, role checks (isOfficial, isSuperAdmin), and helper methods.
 */

import { useState } from 'react';

/**
 * useAuth Hook
 * Reads current user from localStorage and provides role-based helpers.
 * Note: In a larger app, this would use a React Context to allow dynamic updates.
 */
export const useAuth = () => {
  // Initialize state from localStorage (persists across reloads)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Role Checks
  const isOfficial = user?.role === 'official';
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
  
  /**
   * Get the categories managed by the current official.
   * @returns {string[]} Array of category keys
   */
  const getManagedCategories = () => {
    return user?.managedCategories || [];
  };

  /**
   * Helper to manually update user state (e.g. after profile edit).
   * Note: This is a local update, currently unused in production flow.
   */
  const loginAs = (role) => {
   // Logic for mock switching removed for production safety
   // Keeping function stub if future dev testing needs it
  };

  return {
    user,
    isOfficial,
    isSuperAdmin,
    getManagedCategories,
    loginAs
  };
};
