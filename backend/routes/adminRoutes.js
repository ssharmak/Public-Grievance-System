/**
 * @file adminRoutes.js
 * @description Routing for Admin and Official portal operations.
 * Includes dashboard summaries, grievance management, and assignment logic.
 */

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

// Middleware: All admin routes require Authentication and appropriate Role
router.use(verifyToken);
router.use(verifyRole(['admin', 'superadmin', 'official', 'staff']));

/**
 * @route GET /api/admin/grievances/summary
 * @desc Get dashboard statistics (total, pending, resolved counts).
 */
router.get('/grievances/summary', getGrievanceSummary);

/**
 * @route GET /api/admin/grievances/all
 * @desc Retrieve all grievances (sorted by newest).
 */
router.get('/grievances/all', getAllGrievances);

/**
 * @route GET /api/admin/grievance/:id
 * @desc Get detailed view of a specific grievance.
 */
router.get('/grievance/:id', adminGetOne);

/**
 * @route PUT /api/admin/:grievanceId/status
 * @desc Update the status of a grievance.
 */
router.put('/:grievanceId/status', updateGrievanceStatus);

/**
 * @route POST /api/admin/:grievanceId/comment
 * @desc Add an internal comment to a grievance.
 */
router.post('/:grievanceId/comment', addComment);

/**
 * @route GET /api/admin/users/officials
 * @desc Get list of officials for assignment dropdowns.
 */
router.get('/users/officials', getOfficials);

/**
 * @route POST /api/admin/:grievanceId/assign
 * @desc Assign a grievance to a specific official.
 */
router.post('/:grievanceId/assign', assignOfficial);

export default router;