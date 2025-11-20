import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
