import express from 'express';
import { verifyToken, verifyRole } from '../middlewares/authMiddleware.js';
import { checkDepartmentAccess } from '../middlewares/departmentMiddleware.js';
import { 
  getGrievanceSummary, 
  getAllGrievances, 
  updateGrievanceStatus, 
  addComment, 
  getOfficials 
} from '../controllers/adminController.js';
import { adminGetOne } from '../controllers/grievanceController.js';

const router = express.Router();

// All routes require authentication and admin/official/superadmin role
router.use(verifyToken);
router.use(verifyRole(['admin', 'superadmin', 'official', 'staff'])); // Adjust roles as per User model enum

// Summary Dashboard
router.get('/grievances/summary', checkDepartmentAccess, getGrievanceSummary);

// List all (filtered)
router.get('/grievances/all', checkDepartmentAccess, getAllGrievances);

// Single Grievance Details
router.get('/grievance/:id', checkDepartmentAccess, adminGetOne);

// Update Status
router.put('/:grievanceId/status', checkDepartmentAccess, updateGrievanceStatus);

// Add Comment
router.post('/:grievanceId/comment', checkDepartmentAccess, addComment);

// Get Officials (for assignment)
router.get('/users/officials', getOfficials);

export default router;
