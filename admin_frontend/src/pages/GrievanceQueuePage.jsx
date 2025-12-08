/**
 * @file GrievanceQueuePage.jsx
 * @description Page for viewing the list of all grievances.
 * Supports searching by ID/Title and filtering by status (via colored badges).
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchGrievances } from '../services/adminService';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';

// Maps backend status strings to CSS badge classes
const UI_STATUS_MAP = {
  'Pending': 'badge-pending',
  'Submitted': 'badge-pending',
  'Assigned': 'badge-pending',
  'In Progress': 'badge-pending', // Usually blue
  'Resolved': 'badge-resolved',   // Green
  'Rejected': 'badge-rejected'    // Red
};

const GrievanceQueuePage = () => {
  const { isSuperAdmin } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Load Grievances
   * Fetches all grievances on mount. Re-runs if admin role changes (rare).
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGrievances();
        setGrievances(data);
      } catch (error) {
        console.error("Failed to fetch grievances", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isSuperAdmin]);

  // Filter logic: Search by ID or Title
  const filteredGrievances = grievances.filter(g => 
    g.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container">Loading queue...</div>;

  return (
    <div className="container">
      {/* Back Button */}
      <Link to="/admin/dashboard" className="btn btn-secondary mb-4" style={{ display: 'inline-flex', alignItems: 'center', width: 'fit-content' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back 
      </Link>

      {/* Header and Search Bar */}
      <div className="flex justiy-between items-center mb-6">
        <h1 className="text-2xl">Grievance Queue</h1>
        <div className="flex gap-4">
          <div className="flex items-center" style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search ID or Title..." 
              className="input" 
              style={{ paddingLeft: '32px', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredGrievances.map(g => (
              <tr key={g.id}>
                <td className="font-mono text-sm">{g.id}</td>
                <td>{g.title}</td>
                <td style={{ textTransform: 'capitalize' }}>{g.categoryName || g.category}</td>
                <td>
                  <span className={`badge ${UI_STATUS_MAP[g.status] || 'badge-pending'}`}>
                    {g.status}
                  </span>
                </td>
                <td>{g.date}</td>
                <td>
                  <Link to={`/admin/grievance/${g.id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                    View <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredGrievances.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }} className="text-gray">
                  No grievances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GrievanceQueuePage;
