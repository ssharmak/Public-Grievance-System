/**
 * @file authMiddleware.js
 * @description Authentication and Authorization middleware.
 * This file handles user authentication via JWT tokens and role-based access control.
 * It provides middleware to verify tokens, check for admin/superadmin roles, and enforce specific role permissions.
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware to verify JWT Access Token.
 * 
 * Extracts the token from the Authorization header (Bearer token).
 * Verifies the token using the secret key.
 * If valid, finds the user by ID and attaches it to `req.user`.
 * 
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 * @returns {Promise<void>}
 */
export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Full user document attached to request
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * Middleware to restrict access to Admins Only (includes Superadmins).
 * 
 * Checks if the authenticated user has the 'admin' or 'superadmin' role.
 * 
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "superadmin")
    return next();
  return res.status(403).json({ message: "Admin access required" });
};

/**
 * Middleware to restrict access to Super Admins Only.
 * 
 * Checks if the authenticated user has the 'superadmin' role.
 * 
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role === "superadmin") return next();
  return res.status(403).json({ message: "Superadmin access required" });
};

/**
 * Higher-order middleware to restrict access to specific roles.
 * 
 * Returns a middleware function that checks if the user's role is included in the provided allowed roles.
 * 
 * @param {string[]} roles - Array of allowed roles (e.g. ['official', 'admin']).
 * @returns {function} Express middleware function.
 */
export const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: Requires one of ${roles.join(", ")} role`,
      });
    }
    next();
  };
};
