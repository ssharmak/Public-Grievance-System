/**
 * @file DashboardPage.jsx
 * @description Main landing page for the Admin Panel.
 * Displays high-level statistics (Total, Pending, Resolved) and navigation shortcuts.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchSummary } from '../services/adminService';
import { LayoutDashboard, List, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user, isSuperAdmin } = useAuth();
  
  // State for dashboard statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    myDepartmentPending: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Effect: Load Dashboard Data
   * Fetches summary statistics from the backend on component mount.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        console.log("Fetching summary from API...");
        const data = await fetchSummary();
        console.log("Summary data received:", data);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
        setError(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Loading State
  if (loading) return <div className="container">Loading dashboard...</div>;

  // Error State with Force Logout option
  if (error) return (
    <div className="container" style={{ padding: '2rem' }}>
      <div className="alert alert-danger">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <p className="text-sm mt-2">Possible reasons:</p>
        <ul className="list-disc ml-6 text-sm">
          <li>Backend is unreachable (Check VPN/Internet)</li>
          <li>Session expired (Try logging out)</li>
          <li>CORS issue (Check browser console)</li>
        </ul>
        <button 
          className="btn btn-primary mt-4" 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Force Logout & Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Dashboard</h1>
          <p className="text-gray">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/queue" className="btn btn-primary">
            <List size={18} style={{ marginRight: '8px' }} />
            Grievance Queue
          </Link>
          {isSuperAdmin && (
            <Link to="/admin/system" className="btn btn-secondary">
              <Settings size={18} style={{ marginRight: '8px' }} />
              System Management
            </Link>
          )}
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid-cols-4 mb-6">
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray">Total Grievances</p>
              <h3 className="text-2xl">{stats.total}</h3>
            </div>
            <LayoutDashboard color="var(--primary-color)" />
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray">Pending</p>
              <h3 className="text-2xl">{stats.pending}</h3>
            </div>
            <Clock color="var(--warning-color)" />
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray">In Progress</p>
              <h3 className="text-2xl">{stats.inProgress || 0}</h3>
            </div>
            <Clock color="#1E88E5" />
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray">Resolved</p>
              <h3 className="text-2xl">{stats.resolved}</h3>
            </div>
            <CheckCircle color="var(--success-color)" />
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray">Rejected</p>
              <h3 className="text-2xl">{stats.rejected || 0}</h3>
            </div>
            <AlertCircle color="var(--danger-color)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
