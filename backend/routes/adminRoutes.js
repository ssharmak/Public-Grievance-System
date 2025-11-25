import express from 'express';
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';
import {
  getGrievanceSummary,
  getAllGrievances,
  updateGrievanceStatus,
  addComment,
  getOfficials,
  assignOfficial
} from '../controllers/adminController.js';
import { adminGetOne } from '../controllers/grievanceController.js';

const router = express.Router();

// All routes require authentication and admin/official/superadmin role
router.use(verifyToken);
router.use(verifyRole(['admin', 'superadmin', 'official', 'staff']));

// Summary Dashboard - REMOVED checkDepartmentAccess for ALL grievances visibility
router.get('/grievances/summary', getGrievanceSummary);

// List all (filtered) - REMOVED checkDepartmentAccess for ALL grievances visibility
router.get('/grievances/all', getAllGrievances);

// Single Grievance Details - REMOVED checkDepartmentAccess for ALL details visibility
router.get('/grievance/:id', adminGetOne);

// Update Status (Keeping checkDepartmentAccess for action/modification control)
router.put('/:grievanceId/status', updateGrievanceStatus);

// Add Comment (Keeping checkDepartmentAccess for action/modification control)
router.post('/:grievanceId/comment', addComment);

// Get Officials (for assignment)
router.get('/users/officials', getOfficials);

// Assign Official
router.post('/:grievanceId/assign', assignOfficial);

export default router;