import jwt from "jsonwebtoken";

import User from "../models/User.js";

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

    req.user = user; // Full user document
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "superadmin")
    return next();
  return res.status(403).json({ message: "Admin access required" });
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user?.role === "superadmin") return next();
  return res.status(403).json({ message: "Superadmin access required" });
};

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
