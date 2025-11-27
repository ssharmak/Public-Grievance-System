import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchSummary } from '../services/adminService';
import { LayoutDashboard, List, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const DashboardPage = () => {
  const { user, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    myDepartmentPending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSummary();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container">
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
