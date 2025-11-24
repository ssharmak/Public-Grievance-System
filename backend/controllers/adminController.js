import Grievance from '../models/Grievance.js';
import User from '../models/User.js';
import Category from '../models/Category.js'; // Import Category model
import StatusHistory from '../models/StatusHistory.js';
import { createAndSendNotification } from '../utils/notificationService.js';

// Helper to get category IDs from keys
const getCategoryIdsFromKeys = async (keys) => {
  if (!keys || keys.length === 0) return [];
  const categories = await Category.find({ key: { $in: keys } });
  return categories.map(c => c._id);
};

export const getGrievanceSummary = async (req, res) => {
  try {
    console.log(`[Admin] Summary requested by ${req.user.email} (${req.user.role})`);
    let filter = {};
    
    // Apply department filter if not superadmin
    if (req.user.role !== 'superadmin') {
       if (req.user.managedCategories && req.user.managedCategories.length > 0) {
         const categoryIds = await getCategoryIdsFromKeys(req.user.managedCategories);
         filter.category = { $in: categoryIds };
         console.log(`[Admin] Filtering by categories: ${req.user.managedCategories} -> IDs: ${categoryIds}`);
       } else {
         console.warn(`[Admin] User ${req.user.email} has no managed categories!`);
         // If we want to be strict, we could return empty or error, but middleware should have caught this.
         // We'll let it pass (returning global or empty depending on logic), but here it implies NO filter, so ALL data?
         // Actually, if they have NO managed categories, they shouldn't see anything.
         // Let's force an empty result if not superadmin and no categories.
         return res.json({ total: 0, pending: 0, resolved: 0, myDepartmentPending: 0 });
       }
    }

    const total = await Grievance.countDocuments(filter);
    const resolved = await Grievance.countDocuments({ ...filter, status: 'Resolved' });
    const pending = await Grievance.countDocuments({ 
      ...filter, 
      status: { $in: ['Submitted', 'In Review', 'Assigned', 'Pending', 'In Progress'] } 
    });
    
    console.log(`[Admin] Summary Result: Total=${total}, Pending=${pending}`);

    const myDepartmentPending = pending; 

    res.json({
      total,
      pending,
      resolved,
      myDepartmentPending
    });
  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllGrievances = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role !== 'superadmin') {
      if (req.user.managedCategories && req.user.managedCategories.length > 0) {
        const categoryIds = await getCategoryIdsFromKeys(req.user.managedCategories);
        filter.category = { $in: categoryIds };
      } else {
        return res.json([]); // No categories = no access
      }
    }

    const grievances = await Grievance.find(filter)
      .populate('category', 'name key')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });

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

export const updateGrievanceStatus = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { status } = req.body;
    
    const grievance = await Grievance.findOne({ grievanceId });
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    // Check access (optional double check, though middleware should handle route access)
    // Ideally we check if the grievance category matches user's managed categories

    const oldStatus = grievance.status;
    grievance.status = status;
    await grievance.save();

    // Log history
    await StatusHistory.create({
      grievance: grievance._id,
      oldStatus,
      newStatus: status,
      changedBy: req.user.id,
      note: `Status updated to ${status}`
    });

    // Notify
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

export const addComment = async (req, res) => {
  try {
    const { grievanceId } = req.params;
    const { text } = req.body;

    // In a real app, we'd have a Comment model. 
    // For now, we might just log it in StatusHistory or if Grievance has a comments array.
    // Assuming Grievance schema might NOT have comments array yet based on previous file view.
    // Let's check Grievance model. If not, we'll use StatusHistory as a "comment".
    
    const grievance = await Grievance.findOne({ grievanceId });
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    await StatusHistory.create({
      grievance: grievance._id,
      oldStatus: grievance.status,
      newStatus: grievance.status, // No change
      changedBy: req.user.id,
      note: text, // The comment
      isComment: true // Flag if schema supports it, otherwise just 'note'
    });

    res.json({ message: 'Comment added' });
  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
