/**
 * @file adminController.js
 * @description Controller for Admin and Official specific functionalities.
 * Handles dashboard summaries, grievance management (list, update, assign), and official management.
 */

import Grievance from '../models/Grievance.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import StatusHistory from '../models/StatusHistory.js';
import { createAndSendNotification } from '../utils/notificationService.js';

/**
 * Helper: Resolve category keys to MongoDB ObjectIDs
 * @param {string[]} keys - Array of category keys (strings)
 * @returns {Promise<Array>} List of Category ObjectIDs
 */
const getCategoryIdsFromKeys = async (keys) => {
  if (!keys || keys.length === 0) return [];
  const categories = await Category.find({ key: { $in: keys } });
  return categories.map(c => c._id);
};

/**
 * Get Dashboard Summary Statistics
 * Calculates totals for Pending, Resolved, Rejected, and In Progress grievances.
 * @route GET /api/admin/grievances/summary
 */
export const getGrievanceSummary = async (req, res) => {
  try {
    const filter = {}; // Defaults to all grievances

    // Execute count queries in parallel for performance could be optimized, but sequential is fine for now
    const total = await Grievance.countDocuments(filter);
    const resolved = await Grievance.countDocuments({ ...filter, status: 'Resolved' });
    const rejected = await Grievance.countDocuments({ ...filter, status: 'Rejected' });
    const inProgress = await Grievance.countDocuments({ ...filter, status: 'In Progress' });
    const pending = await Grievance.countDocuments({ 
      ...filter, 
      status: { $in: ['Submitted', 'In Review', 'Assigned', 'Pending'] } 
    });

    res.json({
      total,
      pending,
      resolved,
      rejected,
      inProgress
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get All Grievances
 * Retrieves a list of all grievances sorted by date (newest first).
 * @route GET /api/admin/grievances/all
 */
export const getAllGrievances = async (req, res) => {
  try {
    const filter = {};

    const grievances = await Grievance.find(filter)
      .populate('category', 'name key')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Map to frontend-friendly format
    const mapped = grievances.map(g => ({
      id: g.grievanceId,
      _id: g._id,
      title: g.title,
      category: g.category?.key || 'unknown',
      categoryName: g.category?.name || 'Uncategorized',
      status: g.status,
      date: g.createdAt.toISOString().split('T')[0],
      priority: g.priority
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get All Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update Grievance Status
 * Changes the status of a grievance and logs the action in history.
 * Sends a notification to the citizen.
 * @route PUT /api/admin/:grievanceId/status
 */
export const updateGrievanceStatus = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { status } = req.body;
    
    // Find grievance and populate category
    const grievance = await Grievance.findOne({ grievanceId }).populate('category');
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    const oldStatus = grievance.status;
    grievance.status = status;
    await grievance.save();

    // Log status change in history
    await StatusHistory.create({
      grievance: grievance._id,
      oldStatus,
      newStatus: status,
      changedBy: req.user.id,
      note: `Status updated to ${status}`
    });

    // Notify the user about the status update
    if (grievance.userId) {
      await createAndSendNotification(
        grievance.userId,
        'Grievance Status Updated',
        `Your grievance ${grievance.grievanceId} is now ${status}.`,
        { grievanceId: grievance.grievanceId, status }
      );
    }

    res.json(grievance);
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add Comment to Grievance
 * Adds an internal note/comment to the grievance history.
 * @route POST /api/admin/:grievanceId/comment
 */
export const addComment = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { text } = req.body;

    const grievance = await Grievance.findOne({ grievanceId });
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    // Log comment in history
    await StatusHistory.create({
      grievance: grievance._id,
      oldStatus: grievance.status,
      newStatus: grievance.status,
      changedBy: req.user.id,
      note: text,
      isComment: true
    });

    res.json({ message: 'Comment added' });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get List of Officials
 * Retrieves all users with 'official' or 'admin' roles for assignment purposes.
 * @route GET /api/admin/users/officials
 */
export const getOfficials = async (req, res) => {
  try {
    const officials = await User.find({ role: { $in: ['official', 'admin'] } })
      .select('firstName lastName email role managedCategories');
    
    const mapped = officials.map(u => ({
      id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      role: u.role,
      email: u.email
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Get Officials Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Assign Official to Grievance
 * Assigns a specific official to a grievance and updates status to 'Assigned'.
 * Sends a notification to the assigned official.
 * @route POST /api/admin/:grievanceId/assign
 */
export const assignOfficial = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { officialId } = req.body;

    const grievance = await Grievance.findOne({ grievanceId });
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    const official = await User.findById(officialId);
    if (!official) return res.status(404).json({ message: 'Official not found' });

    // Update grievance assignment
    const oldStatus = grievance.status;
    grievance.assignedTo = officialId;
    grievance.status = 'Assigned';
    await grievance.save();

    // Log assignment in history
    await StatusHistory.create({
      grievance: grievance._id,
      oldStatus,
      newStatus: 'Assigned',
      changedBy: req.user.id,
      note: `Assigned to ${official.firstName} ${official.lastName}`,
    });

    // Notify the assigned official
    if (official.email) {
      await createAndSendNotification(
        official._id,
        'New Grievance Assigned',
        `You have been assigned grievance ${grievanceId}.`,
        { grievanceId: grievance.grievanceId }
      );
    }

    res.json({ message: 'Official assigned successfully', grievance });
  } catch (error) {
    console.error('Assign Official Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
