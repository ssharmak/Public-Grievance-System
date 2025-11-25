import { useState, useEffect } from 'react';
import { MOCK_USER_OFFICIAL, MOCK_USER_SUPER_ADMIN } from '../services/api';

// Simple hook that exports mock user object and utility functions
export const useAuth = () => {
  // In a real app, this would come from a Context or Redux store
  // For now, we'll read from localStorage or default to MOCK_USER_OFFICIAL
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const isOfficial = user?.role === 'official';
  const isSuperAdmin = user?.role === 'super_admin';
  
  const getManagedCategories = () => {
    return user?.managedCategories || [];
  };

  // Helper to switch users for testing
  const loginAs = (role) => {
    const newUser = role === 'super_admin' ? MOCK_USER_SUPER_ADMIN : MOCK_USER_OFFICIAL;
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return {
    user,
    isOfficial,
    isSuperAdmin,
    getManagedCategories,
    loginAs
  };
};
