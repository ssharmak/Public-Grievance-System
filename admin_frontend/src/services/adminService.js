import api from './api';

// Fetch Dashboard Summary
export const fetchSummary = async () => {
  const response = await api.get('/admin/grievances/summary');
  return response.data;
};

// Fetch Grievance Queue
export const fetchGrievances = async () => {
  const response = await api.get('/admin/grievances/all');
  return response.data;
};

// Fetch Single Grievance Details
export const fetchGrievanceDetails = async (id) => {
  const response = await api.get(`/admin/grievance/${id}`);
  return response.data;
};

// Update Grievance Status
export const updateGrievanceStatus = async (id, status) => {
  const response = await api.put(`/admin/${id}/status`, { status });
  return response.data;
};

// Add Comment
export const addComment = async (id, text) => {
  const response = await api.post(`/admin/${id}/comment`, { text });
  return response.data;
};

// Get List of Officials
export const getOfficials = async () => {
  const response = await api.get('/admin/users/officials');
  return response.data;
};
