/**
 * @file roleMiddleware.js
 * @description Helper middleware for checking user roles.
 * Note: `authMiddleware.js` contains a more robust version of `verifyRole`.
 * This file verifies if a user possesses one of the allowed roles.
 */

/**
 * Higher-order middleware to restrict access to specific roles.
 * 
 * Checks if `req.user` exists and if `req.user.role` is included in the allowed `roles` array.
 * 
 * @param {string[]} roles - Array of allowed roles. Default is empty array.
 * @returns {function(import("express").Request, import("express").Response, import("express").NextFunction): void} Express middleware function.
 */
export const verifyRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
