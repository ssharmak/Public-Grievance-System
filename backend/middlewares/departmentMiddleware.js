/**
 * @file departmentMiddleware.js
 * @description Middleware to handle Data Access Control based on User Departments.
 * Use this middleware to ensure Officials/Admins only see data relevant to their assigned categories/departments.
 */

/**
 * Middleware to check and attach department access filters.
 * 
 * This middleware inspects the authenticated user (`req.user`) and determines which
 * categories/departments they are allowed to access.
 * 
 * - If the user is a **Super Admin**, they have access to all departments (no filter).
 * - If the user has `managedCategories`, a filter object is attached to `req.departmentFilter`.
 *   This filter should be used in MongoDB queries (e.g., `Grievance.find({ ...req.departmentFilter })`).
 * - If the user has no managed categories, it warns but does not block, allowing controllers to handle empty results.
 * 
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
export const checkDepartmentAccess = (req, res, next) => {
  try {
    const user = req.user;
    
    // Super Admin has access to everything
    if (user.role === 'superadmin') {
      return next();
    }

    // If user has managed categories, set the filter
    if (user.managedCategories && user.managedCategories.length > 0) {
      req.departmentFilter = {
        key: { $in: user.managedCategories }
      };
    } else {
      // No managed categories. 
      // We won't block here with 403, but we'll let the controller return empty data.
      // This prevents UI errors if a user is just set up without categories yet.
      console.warn(`User ${user.email} has no managed categories.`);
    }

    next();
  } catch (error) {
    console.error('Department Middleware Error:', error);
    res.status(500).json({ message: 'Server error checking permissions' });
  }
};
