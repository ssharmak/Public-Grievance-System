import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
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
