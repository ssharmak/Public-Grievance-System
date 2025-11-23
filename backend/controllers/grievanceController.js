import Grievance from "../models/Grievance.js";
import User from "../models/User.js";
import StatusHistory from "../models/StatusHistory.js";
import Notification from "../models/Notification.js";

// Static category list
const CATEGORIES = [
  { key: "electricity", name: "Electricity & Power" },
  { key: "water", name: "Water Supply" },
  { key: "waste", name: "Waste Management" },
  { key: "roads", name: "Roads & Infrastructure" },
  { key: "transport", name: "Public Transport" },
  { key: "safety", name: "Public Safety / Police" },
  { key: "health", name: "Health & Sanitation" },
  { key: "govt", name: "Government Services" },
  { key: "housing", name: "Housing & Building" },
  { key: "environment", name: "Environment" },
  { key: "education", name: "Education" },
  { key: "welfare", name: "Welfare & Social Justice" },
  { key: "others", name: "Others" },
];

const generateGrievanceId = () =>
  "PGS-" +
  Date.now().toString(36).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

export const createGrievance = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      priority,
      location,
      attachments,
      isAnonymous,
    } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({
        message: "Title, category and description are required",
      });
    }

    // FIXED: using key instead of id
    const category = CATEGORIES.find((c) => c.key === categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const userInfo = isAnonymous
      ? null
      : {
          name: req.user.firstName + " " + req.user.lastName,
          email: req.user.email,
          primaryContact: req.user.primaryContact,
        };

    const g = await Grievance.create({
      grievanceId: generateGrievanceId(),
      userId: isAnonymous ? null : req.user.id,
      createdBy: userInfo,
      category,
      title,
      description,
      priority,
      location,
      attachments,
      isAnonymous,
    });

    return res.status(201).json(g);
  } catch (err) {
    console.error("CREATE GRIEVANCE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
