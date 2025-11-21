import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header)
    return res.status(401).json({ message: "No token, authorization denied" });

  // Accept "Bearer <token>" or raw token
  const token = (
    header.startsWith("Bearer ") ? header.slice(7) : header
  ).trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // expects { id, role }
    return next();
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
