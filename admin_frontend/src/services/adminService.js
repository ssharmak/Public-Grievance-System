/**
 * @file adminService.js
 * @description specialized service functions for Admin Dashboard operations.
 * Handles fetching summaries, managing grievance queues, and assigning officials.
 */

import api from './api';

/**
 * Fetch the Dashboard Summary Statistics.
 * Gets the counts of total, pending, resolved, etc. grievances.
 * @returns {Promise<Object>} Summary statistics object.
 */
export const fetchSummary = async () => {
  const response = await api.get('/admin/grievances/summary');
  return response.data;
};

/**
 * Fetch the complete list of Grievances.
 * @returns {Promise<Array>} Array of grievance objects.
 */
export const fetchGrievances = async () => {
  const response = await api.get('/admin/grievances/all');
  return response.data;
};

/**
 * Fetch details for a specific Grievance.
 * Includes status history and attachment URLs.
 * @param {string} id - Grievance ID or MongoDB _id
 * @returns {Promise<Object>} Grievance details object.
 */
export const fetchGrievanceDetails = async (id) => {
  const response = await api.get(`/admin/grievance/${id}`);
  return response.data;
};

/**
 * Update the status of a Grievance.
 * @param {string} id - Grievance ID
 * @param {string} status - New status (e.g., 'In Progress', 'Resolved')
 * @returns {Promise<Object>} Updated grievance object.
 */
export const updateGrievanceStatus = async (id, status) => {
  const response = await api.put(`/admin/${id}/status`, { status });
  return response.data;
};

/**
 * Add an internal comment/note to a Grievance.
 * @param {string} id - Grievance ID
 * @param {string} text - Comment text
 * @returns {Promise<Object>} Response message.
 */
export const addComment = async (id, text) => {
  const response = await api.post(`/admin/${id}/comment`, { text });
  return response.data;
};

/**
 * Get a list of all Officials and Admins.
 * Used for populating the "Assign To" dropdown.
 * @returns {Promise<Array>} List of user objects (officials).
 */
export const getOfficials = async () => {
  const response = await api.get('/admin/users/officials');
  return response.data;
};

/**
 * Assign a Grievance to a specific Official.
 * @param {string} grievanceId - ID of the grievance
 * @param {string} officialId - ID of the official/user
 * @returns {Promise<Object>} Response message and updated grievance.
 */
export const assignOfficial = async (grievanceId, officialId) => {
  const response = await api.post(`/admin/${grievanceId}/assign`, { officialId });
  return response.data;
};
