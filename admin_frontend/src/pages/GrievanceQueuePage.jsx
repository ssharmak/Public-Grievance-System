import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchGrievances } from '../services/adminService';
import { Search, ChevronRight } from 'lucide-react';

const UI_STATUS_MAP = {
  'Pending': 'badge-pending',
  'Submitted': 'badge-pending',
  'Assigned': 'badge-pending',
  'In Progress': 'badge-pending',
  'Resolved': 'badge-resolved',
  'Rejected': 'badge-rejected'
};

const GrievanceQueuePage = () => {
  const { isSuperAdmin } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredGrievances = grievances.filter(g => 
    g.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container">Loading queue...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
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
