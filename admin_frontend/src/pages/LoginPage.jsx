/**
 * @file LoginPage.jsx
 * @description Authentication page for Admins and Officials.
 * Handles user login via email/phone and password using authService.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Note: We use window.location.href for redirection instead of useNavigate
  // to ensure a full state reset after login.

  /**
   * Handle Login Form Submission.
   * Calls login API and redirects to dashboard on success.
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Login successful, token is now in localStorage.
      // Force reload to update global auth state (useAuth).
      window.location.href = '/admin/dashboard'; 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 className="text-2xl mb-6 text-center">Admin Login</h2>
        
        {error && (
          <div className="badge badge-rejected mb-4" style={{ display: 'block', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="text-sm font-bold mb-1 block">Email or Phone</label>
            <input 
              type="text" 
              className="input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-bold mb-1 block">Password</label>
            <input 
              type="password" 
              className="input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
