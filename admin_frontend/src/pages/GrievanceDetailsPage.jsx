import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchGrievanceDetails, updateGrievanceStatus, addComment, getOfficials } from '../services/adminService';
import { ArrowLeft, Download, Send, UserPlus } from 'lucide-react';

const GrievanceDetailsPage = () => {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const { isOfficial } = useAuth();
  const [grievance, setGrievance] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchGrievanceDetails(grievanceId);
      setGrievance(data.grievance);
      setHistory(data.history);
      setStatus(data.grievance.status);
    } catch (error) {
      console.error("Failed to fetch details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [grievanceId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateGrievanceStatus(grievance.grievanceId, newStatus);
      setStatus(newStatus);
      loadData(); // Refresh history
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(grievance.grievanceId, comment);
      setComment('');
      loadData(); // Refresh history
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleLoadOfficials = async () => {
    if (!showAssign && officials.length === 0) {
      try {
        const list = await getOfficials();
        setOfficials(list);
      } catch (error) {
        console.error("Failed to load officials", error);
      }
    }
    setShowAssign(!showAssign);
  };

  if (loading) return <div className="container">Loading details...</div>;
  if (!grievance) return <div className="container">Grievance not found</div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl mb-2">{grievance.title}</h1>
          <div className="flex gap-2 items-center">
            <span className="badge badge-pending">{grievance.grievanceId}</span>
            <span className="text-gray text-sm">{new Date(grievance.createdAt).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="card p-4 flex gap-4 items-center" style={{ padding: '1rem' }}>
          <label className="text-sm font-bold">Status:</label>
          <select 
            className="input" 
            style={{ width: 'auto' }}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="Submitted">Submitted</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid-cols-2">
        <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 className="text-xl mb-4">Details</h3>
            <div className="mb-4">
              <label className="text-sm text-gray block mb-1" style={{ display: 'block' }}>Description</label>
              <p>{grievance.description}</p>
            </div>
            <div className="grid-cols-2 mb-4">
              <div>
                <label className="text-sm text-gray block mb-1" style={{ display: 'block' }}>Category</label>
                <p className="font-medium" style={{ textTransform: 'capitalize' }}>{grievance.category?.name || 'Uncategorized'}</p>
              </div>
              <div>
                <label className="text-sm text-gray block mb-1" style={{ display: 'block' }}>Location</label>
                <p className="font-medium">{grievance.location}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray block mb-1" style={{ display: 'block' }}>Citizen</label>
              <p className="font-medium">{grievance.createdBy?.name || 'Anonymous'}</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl mb-4">Attachments</h3>
            <div className="flex" style={{ flexDirection: 'column', gap: '0.5rem' }}>
              {grievance.attachments && grievance.attachments.length > 0 ? (
                grievance.attachments.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                    <span className="text-sm">{file.split('/').pop()}</span>
                    <a href={`http://localhost:5000${file}`} target="_blank" rel="noreferrer" className="btn btn-secondary text-sm" style={{ textDecoration: 'none' }}>
                      <Download size={14} style={{ marginRight: '4px' }} /> View
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray text-sm">No attachments.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          {isOfficial && (
            <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#dbeafe' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl">Assignment</h3>
                <button 
                  className="btn btn-secondary"
                  onClick={handleLoadOfficials}
                >
                  <UserPlus size={16} style={{ marginRight: '8px' }} /> Assign
                </button>
              </div>
              {showAssign && (
                <div className="flex gap-4">
                  <select className="input">
                    <option value="">Select Official</option>
                    {officials.map(off => (
                      <option key={off.id} value={off.id}>{off.name}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary">Assign</button>
                </div>
              )}
            </div>
          )}

          <div className="card" style={{ flexGrow: 1 }}>
            <h3 className="text-xl mb-4">Activity Log</h3>
            <div className="flex" style={{ flexDirection: 'column', gap: '1rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {history.map((h, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {h.changedBy?.firstName ? `${h.changedBy.firstName} ${h.changedBy.lastName}` : 'System'}
                    </span>
                    <span className="text-sm text-gray">{new Date(h.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">
                    {h.note || `Status changed from ${h.oldStatus} to ${h.newStatus}`}
                  </p>
                </div>
              ))}
              {history.length === 0 && <p className="text-gray text-sm">No activity yet.</p>}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-4">
              <input 
                type="text" 
                className="input" 
                placeholder="Add a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceDetailsPage;
